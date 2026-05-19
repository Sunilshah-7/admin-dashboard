"use client";

import { useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";

import { apiClient } from "@/lib/api-client";
import type { PlaygroundMessage } from "@/types/api";

type SendPromptOptions = {
  preservePrompt?: boolean;
};

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

function usePlayground() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<PlaygroundMessage[]>([]);

  const completionMutation = useMutation({
    mutationFn: (nextPrompt: string) =>
      apiClient.playground.completion({ prompt: nextPrompt }).then((response) => response.data),
    onSuccess: (assistantMessage, nextPrompt) => {
      if (!assistantMessage) {
        return;
      }

      setMessages((currentMessages) => [
        ...currentMessages,
        createUserMessage(nextPrompt),
        assistantMessage,
      ]);
    },
  });

  const tokenCount = useMemo(() => estimateTokenCount(prompt), [prompt]);

  function sendPrompt(nextPrompt = prompt, options: SendPromptOptions = {}) {
    const trimmedPrompt = nextPrompt.trim();

    if (!trimmedPrompt) {
      return;
    }

    completionMutation.mutate(trimmedPrompt);

    if (!options.preservePrompt) {
      setPrompt("");
    }
  }

  function reset() {
    setPrompt("");
    setMessages([]);
    completionMutation.reset();
  }

  return {
    completionMutation,
    error: completionMutation.error,
    isPending: completionMutation.isPending,
    messages,
    prompt,
    reset,
    sendPrompt,
    setMessages,
    setPrompt,
    tokenCount,
  };
}

export { usePlayground };
