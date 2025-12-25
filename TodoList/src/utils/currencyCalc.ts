import { CompletionUsage } from "openai/resources";

const PROMPT_RATE = 0.5;
const COMPLETION_RATE = 1.5;
const USD_TO_VND = 28900;
const TOKENS = 1e6;

export const currencyCalc = (value: number, fractionDigits = 6): string => {
  return (
    new Intl.NumberFormat("vi-VN", {
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    }).format(value) + " ₫"
  );
};

export const calculateFinalUsage = (usage: CompletionUsage): string => {
  const { completion_tokens, prompt_tokens } = usage;

  const completionCost = (completion_tokens * COMPLETION_RATE) / TOKENS;
  const promptCost = (prompt_tokens * PROMPT_RATE) / TOKENS;

  return currencyCalc((completionCost + promptCost) * USD_TO_VND);
};
