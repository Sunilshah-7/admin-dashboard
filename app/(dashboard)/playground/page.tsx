"use client";

import { useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Bot,
  Clipboard,
  Copy,
  GitCompare,
  Loader2,
  MessageSquare,
  RotateCcw,
  Send,
  Settings2,
  Trash2,
  User,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useModelRegistry } from "@/hooks";
import { apiClient } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import type { Model, PlaygroundMessage } from "@/types/api";

type CompletionProvider = "huggingface" | "mock";
type ProviderByMessageId = Record<string, CompletionProvider>;

type CompareResponse = {
  modelId: string;
  modelName: string;
  message: PlaygroundMessage;
  provider: CompletionProvider;
};

const defaultSystemPrompt =
  "You are an AI infrastructure copilot for platform engineers. Be concise, operational, and specific.";

function createMessageId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function estimateTokenCount(content: string) {
  return Math.max(1, Math.ceil(content.trim().length / 4));
}

function createUserMessage(content: string): PlaygroundMessage {
  return {
    id: createMessageId("user"),
    role: "user",
    content,
    createdAt: new Date().toISOString(),
    tokenCount: estimateTokenCount(content),
  };
}

function getAvailableModels(models: Model[]) {
  const deployedModels = models.filter((model) => model.status === "deployed");

  return deployedModels.length ? deployedModels : models;
}

function calculateCost(tokens = 0) {
  return (tokens / 1000) * 0.0024;
}

function formatCost(value: number) {
  return `$${value.toFixed(4)}`;
}

function getModelRegistryContext(models: Model[]) {
  if (!models.length) {
    return "Model registry context: no model records are currently loaded.";
  }

  const modelSummaries = models
    .slice(0, 20)
    .map((model) => {
      const deployments = model.deployments
        .map(
          (deployment) =>
            `${deployment.environment}:${deployment.status}, replicas=${deployment.replicas}`,
        )
        .join("; ");

      return [
        `Name: ${model.name}`,
        `Status: ${model.status}`,
        `Type: ${model.type}`,
        `Current version: ${model.currentVersion}`,
        `p95 latency: ${model.latencyP95Ms}ms`,
        `Error rate: ${model.errorRatePercent}%`,
        `Deployments: ${deployments || "none"}`,
      ].join(" | ");
    })
    .join("\n");

  return `Model registry context:\n${modelSummaries}`;
}

export default function PlaygroundPage() {
  const modelsQuery = useModelRegistry({ page: 1, limit: 20 });
  const models = useMemo(
    () => getAvailableModels(modelsQuery.data?.data ?? []),
    [modelsQuery.data],
  );
  const [selectedModelId, setSelectedModelId] = useState("");
  const [compareModelId, setCompareModelId] = useState("");
  const [compareMode, setCompareMode] = useState(false);
  const [temperature, setTemperature] = useState(0.4);
  const [maxTokens, setMaxTokens] = useState(1024);
  const [topP, setTopP] = useState(0.9);
  const [systemPrompt, setSystemPrompt] = useState(defaultSystemPrompt);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<PlaygroundMessage[]>([]);
  const [compareResponses, setCompareResponses] = useState<CompareResponse[]>([]);
  const [lastProvider, setLastProvider] = useState<CompletionProvider | null>(null);
  const [messageProviders, setMessageProviders] = useState<ProviderByMessageId>({});

  const primaryModel = models.find((model) => model.id === selectedModelId) ?? models[0];
  const secondaryModel =
    models.find((model) => model.id === compareModelId) ??
    models.find((model) => model.id !== primaryModel?.id) ??
    models[1];

  async function requestCompletion({
    modelName,
    prompt,
  }: {
    modelName?: string;
    prompt: string;
  }): Promise<{ message: PlaygroundMessage | null; provider: CompletionProvider }> {
    try {
      const response = await apiClient.playground.huggingFaceCompletion({
        maxTokens,
        model: undefined,
        prompt,
        systemPrompt: `${systemPrompt}\n\n${getModelRegistryContext(models)}\n\nAnswer questions about model status from this context. If a model is not listed, say that it is not present in the loaded registry context.`,
        temperature,
        topP,
      });

      return {
        message: response.data?.message ?? null,
        provider: "huggingface",
      };
    } catch {
      const fallbackPrompt = modelName ? `[${modelName}] ${prompt}` : prompt;
      const fallback = await apiClient.playground
        .completion({ prompt: fallbackPrompt })
        .then((response) => response.data);

      return {
        message: fallback,
        provider: "mock",
      };
    }
  }

  const completionMutation = useMutation({
    mutationFn: (prompt: string) =>
      requestCompletion({
        modelName: primaryModel?.name,
        prompt,
      }),
  });

  const regenerateMutation = useMutation({
    mutationFn: ({ prompt }: { prompt: string; assistantId: string }) =>
      requestCompletion({
        modelName: primaryModel?.name,
        prompt,
      }),
  });

  const totalTokens = messages.reduce((total, message) => total + (message.tokenCount ?? 0), 0);
  const lastAssistant = [...messages].reverse().find((message) => message.role === "assistant");
  const estimatedInputTokens = estimateTokenCount([systemPrompt, input].join("\n"));
  const currentCost = calculateCost(totalTokens + estimatedInputTokens);

  function resolveModelName(modelId: string | undefined) {
    return models.find((model) => model.id === modelId)?.name ?? "Selected model";
  }

  function copyValue(value: string, message: string) {
    void navigator.clipboard?.writeText(value);
    toast.success(message);
  }

  async function sendPrompt(nextPrompt = input) {
    const trimmedPrompt = nextPrompt.trim();

    if (!trimmedPrompt || completionMutation.isPending) {
      return;
    }

    const userMessage = createUserMessage(trimmedPrompt);

    setMessages((current) => [...current, userMessage]);
    setInput("");
    setCompareResponses([]);

    try {
      const completion = await completionMutation.mutateAsync(trimmedPrompt);
      const assistantMessage = completion.message;

      setLastProvider(completion.provider);
      if (completion.provider === "mock") {
        toast.info("Hugging Face unavailable, using mock fallback");
      }

      if (assistantMessage) {
        setMessages((current) => [...current, assistantMessage]);
        setMessageProviders((current) => ({
          ...current,
          [assistantMessage.id]: completion.provider,
        }));
      }

      if (compareMode && primaryModel && secondaryModel) {
        const [primaryResponse, secondaryResponse] = await Promise.all([
          requestCompletion({
            modelName: primaryModel.name,
            prompt: trimmedPrompt,
          }),
          requestCompletion({
            modelName: secondaryModel.name,
            prompt: trimmedPrompt,
          }),
        ]);

        setCompareResponses(
          [
            primaryResponse.message
              ? {
                  message: primaryResponse.message,
                  modelId: primaryModel.id,
                  modelName: primaryModel.name,
                  provider: primaryResponse.provider,
                }
              : null,
            secondaryResponse.message
              ? {
                  message: secondaryResponse.message,
                  modelId: secondaryModel.id,
                  modelName: secondaryModel.name,
                  provider: secondaryResponse.provider,
                }
              : null,
          ].filter(Boolean) as CompareResponse[],
        );
      }
    } catch {
      toast.error("Could not generate completion");
    }
  }

  async function regenerateMessage(assistantId: string) {
    const assistantIndex = messages.findIndex((message) => message.id === assistantId);
    const previousUser = [...messages]
      .slice(0, assistantIndex)
      .reverse()
      .find((message) => message.role === "user");

    if (!previousUser) {
      return;
    }

    try {
      const completion = await regenerateMutation.mutateAsync({
        assistantId,
        prompt: previousUser.content,
      });
      const replacement = completion.message;

      if (!replacement) {
        return;
      }

      setLastProvider(completion.provider);
      if (completion.provider === "mock") {
        toast.info("Hugging Face unavailable, using mock fallback");
      }

      setMessages((current) =>
        current.map((message) => (message.id === assistantId ? replacement : message)),
      );
      setMessageProviders((current) => ({
        ...current,
        [assistantId]: completion.provider,
        [replacement.id]: completion.provider,
      }));
      toast.success("Response regenerated");
    } catch {
      toast.error("Could not regenerate response");
    }
  }

  function clearConversation() {
    setMessages([]);
    setCompareResponses([]);
    setMessageProviders({});
    completionMutation.reset();
    regenerateMutation.reset();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">AI Playground</h2>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Test prompts, tune model parameters, compare responses, and inspect request metrics.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge className="w-fit rounded-md" variant="secondary">
            Engineer workspace
          </Badge>
          <Badge className="w-fit rounded-md" variant="outline">
            Powered by Hugging Face
          </Badge>
        </div>
      </div>

      <section className="grid gap-4 xl:grid-cols-[360px_1fr]">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings2 className="size-4" />
                Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="primaryModel" className="text-sm font-medium">
                  Model
                </label>
                <Select
                  value={primaryModel?.id ?? ""}
                  onValueChange={(value) => setSelectedModelId(value)}
                >
                  <SelectTrigger id="primaryModel" className="w-full">
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    {models.map((model) => (
                      <SelectItem key={model.id} value={model.id}>
                        {model.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between gap-4 rounded-md border p-3">
                <div>
                  <div className="text-sm font-medium">Compare mode</div>
                  <div className="text-xs text-muted-foreground">
                    Generate side-by-side outputs.
                  </div>
                </div>
                <Switch checked={compareMode} onCheckedChange={setCompareMode} />
              </div>

              {compareMode ? (
                <div className="space-y-2">
                  <label htmlFor="compareModel" className="text-sm font-medium">
                    Compare against
                  </label>
                  <Select
                    value={secondaryModel?.id ?? ""}
                    onValueChange={(value) => setCompareModelId(value)}
                  >
                    <SelectTrigger id="compareModel" className="w-full">
                      <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent>
                      {models
                        .filter((model) => model.id !== primaryModel?.id)
                        .map((model) => (
                          <SelectItem key={model.id} value={model.id}>
                            {model.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : null}

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <label htmlFor="temperature" className="font-medium">
                      Temperature
                    </label>
                    <span className="text-muted-foreground">{temperature.toFixed(1)}</span>
                  </div>
                  <Input
                    id="temperature"
                    max={1}
                    min={0}
                    step={0.1}
                    type="range"
                    value={temperature}
                    onChange={(event) => setTemperature(Number(event.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <label htmlFor="maxTokens" className="font-medium">
                      Max tokens
                    </label>
                    <span className="text-muted-foreground">{maxTokens}</span>
                  </div>
                  <Input
                    id="maxTokens"
                    max={4096}
                    min={256}
                    step={256}
                    type="range"
                    value={maxTokens}
                    onChange={(event) => setMaxTokens(Number(event.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <label htmlFor="topP" className="font-medium">
                      Top-p
                    </label>
                    <span className="text-muted-foreground">{topP.toFixed(2)}</span>
                  </div>
                  <Input
                    id="topP"
                    max={1}
                    min={0.1}
                    step={0.05}
                    type="range"
                    value={topP}
                    onChange={(event) => setTopP(Number(event.target.value))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="systemPrompt" className="text-sm font-medium">
                  System prompt
                </label>
                <Textarea
                  id="systemPrompt"
                  className="min-h-32"
                  value={systemPrompt}
                  onChange={(event) => setSystemPrompt(event.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="size-4" />
                Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm">
              <div className="flex items-center justify-between rounded-md border p-3">
                <span className="text-muted-foreground">Tokens used</span>
                <span className="font-medium">{totalTokens.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between rounded-md border p-3">
                <span className="text-muted-foreground">Prompt estimate</span>
                <span className="font-medium">{estimatedInputTokens.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between rounded-md border p-3">
                <span className="text-muted-foreground">Last latency</span>
                <span className="font-medium">{lastAssistant?.latencyMs ?? "--"}ms</span>
              </div>
              <div className="flex items-center justify-between rounded-md border p-3">
                <span className="text-muted-foreground">Cost estimate</span>
                <span className="font-medium">{formatCost(currentCost)}</span>
              </div>
              <div className="flex items-center justify-between rounded-md border p-3">
                <span className="text-muted-foreground">Provider</span>
                <span className="font-medium">
                  {lastProvider === "huggingface"
                    ? "Hugging Face"
                    : lastProvider === "mock"
                      ? "Mock fallback"
                      : "Ready"}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="min-h-[680px]">
            <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="size-4" />
                  Chat
                </CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">
                  {resolveModelName(primaryModel?.id)} · temp {temperature.toFixed(1)} · top-p{" "}
                  {topP.toFixed(2)}
                </p>
              </div>
              <Button
                disabled={!messages.length && !compareResponses.length}
                type="button"
                variant="outline"
                onClick={clearConversation}
              >
                <Trash2 className="size-4" />
                Clear
              </Button>
            </CardHeader>
            <CardContent className="flex min-h-[560px] flex-col gap-4">
              <div className="flex-1 space-y-4 rounded-md border bg-muted/20 p-4">
                {messages.length === 0 ? (
                  <div className="flex min-h-80 items-center justify-center text-center text-sm text-muted-foreground">
                    Send a prompt to start testing model behavior.
                  </div>
                ) : null}

                {messages.map((message) => {
                  const isAssistant = message.role === "assistant";
                  const Icon = isAssistant ? Bot : User;

                  return (
                    <div
                      key={message.id}
                      className={cn(
                        "rounded-md border bg-background p-4",
                        !isAssistant && "ml-auto max-w-[86%] bg-primary text-primary-foreground",
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 gap-3">
                          <div
                            className={cn(
                              "mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md border",
                              !isAssistant && "border-primary-foreground/30",
                            )}
                          >
                            <Icon className="size-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-medium">
                              {isAssistant ? resolveModelName(primaryModel?.id) : "You"}
                            </div>
                            {isAssistant ? (
                              <Badge className="mt-2" variant="outline">
                                {messageProviders[message.id] === "huggingface"
                                  ? "Hugging Face"
                                  : "Mock fallback"}
                              </Badge>
                            ) : null}
                            <div className="mt-2 whitespace-pre-wrap text-sm leading-6">
                              {message.content}
                            </div>
                            <div
                              className={cn(
                                "mt-3 text-xs text-muted-foreground",
                                !isAssistant && "text-primary-foreground/70",
                              )}
                            >
                              {message.tokenCount ?? estimateTokenCount(message.content)} tokens
                              {message.latencyMs ? ` · ${message.latencyMs}ms` : ""}
                            </div>
                          </div>
                        </div>
                        <div className="flex shrink-0 gap-1">
                          <Button
                            aria-label="Copy message"
                            size="icon-sm"
                            type="button"
                            variant={isAssistant ? "ghost" : "secondary"}
                            onClick={() => copyValue(message.content, "Message copied")}
                          >
                            <Copy className="size-4" />
                          </Button>
                          {isAssistant ? (
                            <Button
                              aria-label="Regenerate response"
                              disabled={regenerateMutation.isPending}
                              size="icon-sm"
                              type="button"
                              variant="ghost"
                              onClick={() => regenerateMessage(message.id)}
                            >
                              <RotateCcw className="size-4" />
                            </Button>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {completionMutation.isPending ? (
                  <div className="rounded-md border bg-background p-4">
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Loader2 className="size-4 animate-spin" />
                      Generating response...
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="grid gap-2">
                <Textarea
                  aria-label="User message"
                  className="min-h-24"
                  placeholder="Ask the model to investigate latency, draft a rollback plan, or compare GPU capacity..."
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={(event) => {
                    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
                      void sendPrompt();
                    }
                  }}
                />
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-xs text-muted-foreground">
                    {estimateTokenCount(input).toLocaleString()} estimated input tokens
                  </div>
                  <Button
                    disabled={!input.trim() || completionMutation.isPending}
                    onClick={() => void sendPrompt()}
                  >
                    {completionMutation.isPending ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Send className="size-4" />
                    )}
                    Send
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {compareMode ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GitCompare className="size-4" />
                  Compare Mode
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 lg:grid-cols-2">
                {[primaryModel, secondaryModel].filter(Boolean).map((model) => {
                  const response = compareResponses.find((item) => item.modelId === model?.id);

                  return (
                    <div key={model?.id} className="rounded-md border p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="font-medium">{model?.name}</div>
                        <Badge variant="outline">{model?.type}</Badge>
                      </div>
                      <div className="mt-4 min-h-32 text-sm leading-6 text-muted-foreground">
                        {response?.message.content ??
                          (completionMutation.isPending
                            ? "Waiting for response..."
                            : "Send a prompt to compare this model.")}
                      </div>
                      {response ? (
                        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                          <span>
                            {response.message.tokenCount ??
                              estimateTokenCount(response.message.content)}{" "}
                            tokens · {response.message.latencyMs ?? "--"}ms
                          </span>
                          <Badge variant="outline">
                            {response.provider === "huggingface" ? "Hugging Face" : "Mock"}
                          </Badge>
                          <Button
                            size="sm"
                            type="button"
                            variant="outline"
                            onClick={() =>
                              copyValue(response.message.content, "Comparison response copied")
                            }
                          >
                            <Clipboard className="size-4" />
                            Copy
                          </Button>
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          ) : null}
        </div>
      </section>
    </div>
  );
}
