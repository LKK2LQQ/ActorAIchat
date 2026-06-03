/**
 * Model pricing table and cost estimation.
 *
 * Prices in USD per 1K tokens. Sources: official provider pricing pages (2026 Q2).
 */
export interface ModelPricing {
  inputPer1K: number;
  outputPer1K: number;
}

const PRICING: Record<string, ModelPricing> = {
  // OpenAI
  "gpt-5": { inputPer1K: 0.0125, outputPer1K: 0.05 },
  "gpt-5-mini": { inputPer1K: 0.005, outputPer1K: 0.02 },
  "gpt-5-nano": { inputPer1K: 0.0015, outputPer1K: 0.006 },
  "gpt-5-chat": { inputPer1K: 0.0125, outputPer1K: 0.05 },

  // Anthropic
  "claude-opus-4-8": { inputPer1K: 0.015, outputPer1K: 0.075 },
  "claude-opus-4-7": { inputPer1K: 0.015, outputPer1K: 0.075 },
  "claude-sonnet-4-6": { inputPer1K: 0.003, outputPer1K: 0.015 },
  "claude-haiku-4-5-20251001": { inputPer1K: 0.0008, outputPer1K: 0.004 },

  // Google
  "gemini-2.5-pro": { inputPer1K: 0.00125, outputPer1K: 0.01 },
  "gemini-2.5-pro-preview-06-05": { inputPer1K: 0.00125, outputPer1K: 0.01 },

  // DeepSeek
  "deepseek-v4-pro": { inputPer1K: 0.002, outputPer1K: 0.008 },
  "deepseek-v4-flash": { inputPer1K: 0.0005, outputPer1K: 0.002 },

  // Moonshot
  "kimi-k2-0711-preview": { inputPer1K: 0.001, outputPer1K: 0.004 },
  "kimi-latest": { inputPer1K: 0.001, outputPer1K: 0.004 },

  // XAI
  "grok-4": { inputPer1K: 0.005, outputPer1K: 0.015 },
  "grok-4-0709": { inputPer1K: 0.005, outputPer1K: 0.015 },
  "grok-4-fast-non-reasoning": { inputPer1K: 0.002, outputPer1K: 0.006 },
  "grok-4-fast-reasoning": { inputPer1K: 0.002, outputPer1K: 0.006 },
  "grok-code-fast-1": { inputPer1K: 0.002, outputPer1K: 0.006 },

  // ByteDance
  "doubao-seed-1.8": { inputPer1K: 0.001, outputPer1K: 0.004 },
  "doubao-seed-1.6": { inputPer1K: 0.001, outputPer1K: 0.004 },

  // Alibaba
  "qwen3-max": { inputPer1K: 0.002, outputPer1K: 0.008 },
  "qwen3-next": { inputPer1K: 0.002, outputPer1K: 0.008 },
  "qwen3-235b-a22b": { inputPer1K: 0.001, outputPer1K: 0.004 },
  "qwen3-32b": { inputPer1K: 0.0005, outputPer1K: 0.002 },
};

export function estimateCost(
  model: string,
  promptTokens: number,
  completionTokens: number,
): number {
  const pricing = PRICING[model];
  if (!pricing) return 0;
  return (
    (pricing.inputPer1K * promptTokens +
      pricing.outputPer1K * completionTokens) /
    1000
  );
}
