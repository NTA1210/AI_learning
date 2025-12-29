import OpenAI from "openai";
import dotenv from "dotenv";
import { context, trimContextIfNeeded } from "./context";
import { tools } from "./toolsList";
import { calculateFinalUsage } from "@/utils/currencyCalc";
import { CompletionUsage } from "openai/resources";
import { dispatchToolCall, toolHandlers } from "@/controllers/toolsHandler";
dotenv.config();

let openAI: OpenAI;
const COMPLETION_BUFFER = 200;

try {
  openAI = new OpenAI();
} catch (error) {
  console.error("Failed to create OpenAI client:", error);
  process.exit(1);
}

async function callOpenAIWithFunctions() {
  trimContextIfNeeded();

  const response = await openAI.chat.completions.create({
    model: process.env.OPENAI_MODEL as string,
    messages: context,
    max_completion_tokens: COMPLETION_BUFFER,
    tools: tools,
    tool_choice: "auto",
  });

  const msg = response.choices[0]?.message;
  const toolCalls = msg?.tool_calls || [];

  if (toolCalls && toolCalls.length > 0) {
    context.push({
      ...msg,
      content: msg?.content ?? "",
    });

    // Dispatch each tool call
    for (const toolCall of toolCalls) {
      const functionName = (toolCall as any).function.name;
      const args = JSON.parse((toolCall as any).function.arguments);

      // Dispatch the tool call
      let result;
      try {
        // Check if the function exists
        if (!(functionName in toolHandlers)) {
          throw new Error(`Unknown tool: ${functionName}`);
        }

        result = await dispatchToolCall(functionName, args);
      } catch (e) {
        result = { error: (e as Error).message };
      }

      // Push the result to the context
      context.push({
        role: "tool",
        content: JSON.stringify(result) || "",
        tool_call_id: (toolCall as any).id,
      });
    }

    const secondResponse = await openAI.chat.completions.create({
      model: process.env.OPENAI_MODEL as string,
      messages: context,
      max_completion_tokens: COMPLETION_BUFFER,
    });

    const secondMsg = secondResponse.choices[0]?.message;

    context.push({ ...secondMsg, content: secondMsg?.content ?? "" });

    console.log(secondResponse.choices[0].message.content);

    const firstResponseCost = calculateFinalUsage(
      response.usage as CompletionUsage
    );
    const secondResponseCost = calculateFinalUsage(
      secondResponse.usage as CompletionUsage
    );

    console.log(
      `First response cost(${response.usage?.prompt_tokens}-${response.usage?.completion_tokens}): ${firstResponseCost} VND, Second response cost(${secondResponse.usage?.prompt_tokens}-${secondResponse.usage?.completion_tokens}): ${secondResponseCost} VND`
    );
  } else {
    context.push({ ...msg, content: msg?.content ?? "" });
    console.log(response.choices[0].message.content);

    const responseCost = calculateFinalUsage(response.usage as CompletionUsage);
    console.log(
      `Response cost(${response.usage?.prompt_tokens}-${response.usage?.completion_tokens}): ${responseCost} VND`
    );
  }
}

// main
console.log("Hello I'm your tasks manager assistant!");

process.stdin.addListener("data", async function (input) {
  let userInput = input.toString().trim();
  if (userInput === "exit") {
    process.exit(0);
  }
  context.push({
    role: "user",
    content: userInput,
  });
  try {
    await callOpenAIWithFunctions();
  } catch (err) {
    console.error("CAUGHT ERROR:");
    console.dir(err, { depth: null });
    process.exit(1);
  }
});
