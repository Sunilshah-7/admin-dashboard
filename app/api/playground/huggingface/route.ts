import type { PlaygroundMessage } from "@/types/api";

type HuggingFaceChatChoice = {
  message?: {
    content?: string;
  };
};

type HuggingFaceChatResponse = {
  choices?: HuggingFaceChatChoice[];
  usage?: {
    completion_tokens?: number;
    total_tokens?: number;
  };
};

type PlaygroundHuggingFaceRequest = {
  prompt?: string;
  systemPrompt?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
};

const defaultModel = process.env.HUGGINGFACE_MODEL ?? "Qwen/Qwen2.5-7B-Instruct-1M:fastest";

function jsonError(message: string, status: number, code: string) {
  return Response.json(
    {
      data: null,
      error: {
        code,
        message,
      },
    },
    { status },
  );
}

function createAssistantMessage(
  content: string,
  tokenCount?: number,
  latencyMs?: number,
): PlaygroundMessage {
  return {
    id: `hf_message_${Date.now()}`,
    role: "assistant",
    content,
    createdAt: new Date().toISOString(),
    tokenCount: tokenCount ?? Math.max(1, Math.ceil(content.length / 4)),
    latencyMs,
  };
}

export async function POST(request: Request) {
  const token = process.env.HF_TOKEN;

  if (!token) {
    return jsonError("HF_TOKEN is not configured.", 503, "huggingface_not_configured");
  }

  const body = (await request.json()) as PlaygroundHuggingFaceRequest;
  const prompt = body.prompt?.trim();

  if (!prompt) {
    return jsonError("Prompt is required.", 400, "missing_prompt");
  }

  const startedAt = Date.now();
  const response = await fetch("https://router.huggingface.co/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: body.model || defaultModel,
      messages: [
        {
          role: "system",
          content:
            body.systemPrompt || "You are an AI infrastructure copilot for platform engineers.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: body.maxTokens ?? 1024,
      temperature: body.temperature ?? 0.4,
      top_p: body.topP ?? 0.9,
    }),
  });

  if (!response.ok) {
    const status = response.status === 429 ? 429 : 502;
    const code = response.status === 429 ? "huggingface_rate_limited" : "huggingface_error";

    return jsonError("Hugging Face completion failed.", status, code);
  }

  const payload = (await response.json()) as HuggingFaceChatResponse;
  const content = payload.choices?.[0]?.message?.content?.trim();

  if (!content) {
    return jsonError("Hugging Face returned an empty response.", 502, "huggingface_empty_response");
  }

  return Response.json({
    data: {
      message: createAssistantMessage(
        content,
        payload.usage?.completion_tokens ?? payload.usage?.total_tokens,
        Date.now() - startedAt,
      ),
      model: body.model || defaultModel,
      provider: "huggingface",
    },
    meta: {
      generatedAt: new Date().toISOString(),
    },
    error: null,
  });
}
