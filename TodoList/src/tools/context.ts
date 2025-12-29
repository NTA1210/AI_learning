import OpenAI from "openai";
import { encoding_for_model, TiktokenModel } from "tiktoken";
import dotenv from "dotenv";
dotenv.config();

const encoder = encoding_for_model(process.env.OPENAI_MODEL as TiktokenModel);
const MAX_CONTEXT_TOKENS = 500;

export const context: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
  {
    role: "developer",
    content: `You are a helpful assistant that manages daily tasks for me which will list all tasks and allow me to create, update, delete tasks. NOTE: 1/ If got error, notify me
          2/ If is a delete api, confirm before delete
          3/ If is a create api, confirm before create`,
  },
];

export function trimContextIfNeeded() {
  let contextLength = getContextLength();
  console.log("Context length:", contextLength);

  while (contextLength > MAX_CONTEXT_TOKENS) {
    const index = context.findIndex(
      (m) => !["system", "developer"].includes(m.role)
    );
    if (index === -1) break;

    context.splice(index, 1);
    contextLength = getContextLength();
    console.log("New context length:", contextLength);
  }
}

export function getContextLength() {
  let length: number = 0;

  context.forEach((mess) => {
    if (typeof mess.content === "string") {
      length += encoder.encode(mess.content).length;
    } else if (Array.isArray(mess.content)) {
      mess.content.forEach((content) => {
        if (content.type === "text") {
          length += encoder.encode(content.text).length;
        }
      });
    }
  });
  return length;
}
