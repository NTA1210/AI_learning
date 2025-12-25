import OpenAI from "openai";
import dotenv from "dotenv";
import type { CompletionUsage } from "openai/resources";
import { currencyCalc } from "@/utils/currencyCalc";

dotenv.config();

let openAI: OpenAI;
const PROMPT_RATE = 0.5;
const COMPLETION_RATE = 1.5;
const USD_TO_VND = 28900;

try {
  openAI = new OpenAI();
} catch (err) {
  console.error("Failed to create OpenAI client:", err);
  process.exit(1);
}

type TFlight = {
  departure: string;
  destination: string;
  flights: string[];
};

function getAvailableFlights(departure: string, destination: string): string[] {
  console.log("Getting available flights");
  const available: TFlight[] = [
    {
      departure: "SFO",
      destination: "LAX",
      flights: ["UA 123", "AA 456"],
    },
    {
      departure: "DFW",
      destination: "LAX",
      flights: ["AA 789", "UA 321"],
    },
  ];

  return available
    .filter(
      (flight) =>
        flight.departure === departure && flight.destination === destination
    )
    .flatMap((flight) => flight.flights);
}

function reserveFlight(flightNumber: string): string | "FULLY_BOOKED" {
  if (flightNumber === "UA 321") {
    return "FULLY_BOOKED";
  }
  console.log(`Reserving flight ${flightNumber}`);
  return "FD123456";
}

const context: OpenAI.Chat.ChatCompletionMessageParam[] = [
  {
    role: "developer",
    content:
      "You are a helpful assistant that gives information about flights and makes reservations",
  },
];

const tools: OpenAI.Chat.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "getAvailableFlights",
      description:
        "returns the available flights for a given departure and destination",
      parameters: {
        type: "object",
        properties: {
          departure: {
            type: "string",
            description: "The departure airport code",
          },
          destination: {
            type: "string",
            description: "The destination airport code",
          },
        },
        required: ["departure", "destination"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "reserveFlight",
      description: "reserves a flight for a given flight number",
      parameters: {
        type: "object",
        properties: {
          flightNumber: {
            type: "string",
            description: "The flight number to reserve",
          },
        },
        required: ["flightNumber"],
      },
    },
  },
];

async function callOpenAIWithFunctions() {
  const response = await openAI.chat.completions.create({
    model: process.env.OPENAI_MODEL as string,
    messages: context,
    max_completion_tokens: 200,
    tools,
    tool_choice: "auto",
  });

  const willInvokeFunction =
    response.choices[0]?.finish_reason === "tool_calls";

  if (willInvokeFunction) {
    const toolCall = response.choices[0]?.message.tool_calls![0];

    if (toolCall) {
      const functionName = (toolCall as any).function.name;

      if (functionName === "getAvailableFlights") {
        const rawArgs = JSON.parse((toolCall as any).function.arguments);
        const { departure, destination } = rawArgs;
        const availableFlights = getAvailableFlights(departure, destination);

        context.push(response.choices[0]?.message as any);
        context.push({
          role: "tool",
          content: availableFlights.toString(),
          tool_call_id: (toolCall as any).id,
        });
      }

      if (functionName === "reserveFlight") {
        const rawArgs = JSON.parse((toolCall as any).function.arguments);
        const { flightNumber } = rawArgs;
        const reservationNumber = reserveFlight(flightNumber);

        context.push(response.choices[0]?.message as any);
        context.push({
          role: "tool",
          content: reservationNumber,
          tool_call_id: (toolCall as any).id,
        });
      }
    }
  }

  const secondResponse = await openAI.chat.completions.create({
    model: process.env.OPENAI_MODEL as string,
    messages: context,
    max_completion_tokens: 200,
  });

  console.log(secondResponse.choices[0]?.message.content);

  // calculate cost
  const { prompt_tokens, completion_tokens } =
    response.usage as CompletionUsage;

  const {
    prompt_tokens: secondPrompt_tokens,
    completion_tokens: secondCompletion_tokens,
  } = secondResponse.usage as CompletionUsage;

  const promptCostUSD =
    ((prompt_tokens + secondPrompt_tokens) * PROMPT_RATE) / 1e6;

  const completionCostUSD =
    ((completion_tokens + secondCompletion_tokens) * COMPLETION_RATE) / 1e6;

  const totalCostUSD = promptCostUSD + completionCostUSD;
  const totalCostVND = totalCostUSD * USD_TO_VND;

  console.log(
    "Total tokens:",
    prompt_tokens +
      secondPrompt_tokens +
      completion_tokens +
      secondCompletion_tokens
  );

  console.log(`Total cost: ${currencyCalc(totalCostVND)}`);
}

// main
console.log("Hello from flight assistant chatbot!");

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
    console.error("🔥 CAUGHT ERROR:");
    console.dir(err, { depth: null });
    process.exit(1);
  }
});
