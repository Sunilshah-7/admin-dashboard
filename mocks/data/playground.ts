import { faker } from "@faker-js/faker";

import { generateModels } from "@/mocks/data/model-registry";
import type { PlaygroundMessage, PlaygroundSession } from "@/types/api";

const MOCK_RESPONSES = [
  "The deployment looks healthy. I would watch p95 latency and GPU memory pressure over the next release window.",
  "Based on the recent logs, the safest next step is to retry staging with the previous autoscaling floor.",
  "The model registry shows a stable candidate. Promote the newest version only after the regression suite passes.",
  "I found a likely capacity bottleneck in the inference pool. Increase replicas before expanding batch size.",
];

function generatePlaygroundMessage(
  role: PlaygroundMessage["role"],
  content: string,
  index: number,
): PlaygroundMessage {
  return {
    id: `playground_message_${index}`,
    role,
    content,
    createdAt: faker.date.recent({ days: 3 }).toISOString(),
    tokenCount: Math.ceil(content.length / 4),
    latencyMs: role === "assistant" ? faker.number.int({ min: 180, max: 1800 }) : undefined,
  };
}

function generateMockCompletion(prompt: string): PlaygroundMessage {
  faker.seed(prompt.length + 2708);

  return generatePlaygroundMessage(
    "assistant",
    faker.helpers.arrayElement(MOCK_RESPONSES),
    faker.number.int({ min: 100, max: 999 }),
  );
}

function generatePlaygroundSessions(count = 6): PlaygroundSession[] {
  faker.seed(2707);

  const models = generateModels(8);

  return Array.from({ length: count }, (_, index) => {
    const model = faker.helpers.arrayElement(models);
    const userPrompt = faker.helpers.arrayElement([
      "Summarize the latest production deployment risk.",
      "Explain why inference latency increased today.",
      "Draft a rollback plan for a degraded model endpoint.",
      "Compare current GPU utilization against last week.",
    ]);
    const messages = [
      generatePlaygroundMessage(
        "system",
        "You are an AI infrastructure copilot for platform engineers.",
        index * 10 + 1,
      ),
      generatePlaygroundMessage("user", userPrompt, index * 10 + 2),
      generateMockCompletion(userPrompt),
    ];

    return {
      id: `playground_session_${index + 1}`,
      title: faker.helpers.arrayElement([
        "Deployment review",
        "Latency investigation",
        "Capacity planning",
        "Rollback rehearsal",
      ]),
      modelId: model.id,
      temperature: Number(faker.number.float({ min: 0.1, max: 0.9 }).toFixed(1)),
      maxTokens: faker.helpers.arrayElement([512, 1024, 2048, 4096]),
      messages,
      createdBy: faker.internet.email({ provider: "imd.ai" }),
      createdAt: faker.date.recent({ days: 10 }).toISOString(),
      updatedAt: faker.date.recent({ days: 2 }).toISOString(),
    };
  });
}

export { generateMockCompletion, generatePlaygroundSessions };
