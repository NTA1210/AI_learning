import { Pinecone } from "@pinecone-database/pinecone";
import dotenv from "dotenv";
import { text } from "node:stream/consumers";
import OpenAI from "openai";

dotenv.config();

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY as string,
});

const openai = new OpenAI();
const INDEX_NAME = "content-index";

const studentInfo = `Alexandra Thompson, a 19-year-old computer science sophomore with a 3.7 GPA,
is a member of the programming and chess clubs who enjoys pizza, swimming, and hiking
in her free time in hopes of working at a tech company after graduating from the University of Washington.`;

const clubInfo = `The university chess club provides an outlet for students to come together and enjoy playing
the classic strategy game of chess. Members of all skill levels are welcome, from beginners learning
the rules to experienced tournament players. The club typically meets a few times per week to play casual games,
participate in tournaments, analyze famous chess matches, and improve members' skills.`;

const universityInfo = `The University of Washington, founded in 1861 in Seattle, is a public research university
with over 45,000 students across three campuses in Seattle, Tacoma, and Bothell.
As the flagship institution of the six public universities in Washington state,
UW encompasses over 500 buildings and 20 million square feet of space,
including one of the largest library systems in the world.`;

type Info = {
  _id: string;
  info: string;
  reference: string;
  relevance: number;
};

const dataToEmbed: Info[] = [
  {
    _id: "id-1",
    info: studentInfo,
    reference: "some student 123",
    relevance: 0.9,
  },
  {
    _id: "id-2",
    info: clubInfo,
    reference: "some club 456",
    relevance: 0.8,
  },
  {
    _id: "id-3",
    info: universityInfo,
    reference: "some university 789",
    relevance: 0.7,
  },
];

const pcIndex = pc.index<Info>("content-index").namespace("my-namespace");

async function createIndex() {
  await pc.createIndexForModel({
    name: INDEX_NAME,
    cloud: "aws",
    region: "us-east-1",
    embed: {
      model: "llama-text-embed-v2",
      fieldMap: {
        text: "info",
      },
    },
    waitUntilReady: true,
  });
}

// createIndex()

async function upsertData() {
  await pcIndex.upsertRecords(dataToEmbed);
}

// upsertData();

async function queryEmbedding(input: string) {
  const result = await pcIndex.searchRecords({
    query: {
      topK: 1,
      inputs: {
        text: input,
      },
    },
  });
  console.log(result);

  return result;
}

async function askOpenAI(question: string, relevantInfo: string) {
  const response = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL as string,
    messages: [
      {
        role: "assistant",
        content: `Answer the next question using this information: ${relevantInfo}`, // context injection
      },
      {
        role: "user",
        content: question,
      },
    ],
  });

  const responseMess = response.choices[0].message;

  return responseMess.content;
}

async function main() {
  const question = "What does Alexandra Thompson like to do in her free time?";
  const result = await queryEmbedding(question);

  const relevantInfo = result.result.hits[0];
  if (relevantInfo) {
    const response = await askOpenAI(
      question,
      (relevantInfo.fields as any).info
    );
    console.log(response);
  }
}

main();
