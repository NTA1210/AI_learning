import OpenAI from "openai";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

dotenv.config();

const openAI = new OpenAI();

export type DataWithEmbeddings = {
  input: string;
  embedding: number[];
};

export async function generateEmbedding(input: string | string[]) {
  const response = await openAI.embeddings.create({
    input,
    model: "text-embedding-3-small",
  });
  console.log(response);
  return response;
}

export function loadJSONData<T>(fileName: string): T {
  const filePath = path.join(__dirname, fileName);
  const rawData = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(rawData) as T;
}

export function saveDataToJsonFile(data: any, fileName: string) {
  const dataString = JSON.stringify(data, null, 2);
  const dataBuffer = Buffer.from(dataString, "utf-8");
  const filePath = path.join(__dirname, fileName);
  fs.writeFileSync(filePath, dataBuffer);
  console.log(`saved data to ${fileName}`);
}

// generateEmbedding([
//   "Dog is sleeping under the tree",
//   "Cat is sleeping on the couch",
// ]);

async function main() {
  const data = loadJSONData<string[]>("data2.json");
  const embeddings = await generateEmbedding(data);
  const dataWithEmbeddings: DataWithEmbeddings[] = [];

  for (let i = 0; i < data.length; i++) {
    dataWithEmbeddings.push({
      input: data[i],
      embedding: embeddings.data[i].embedding,
    });
  }
  saveDataToJsonFile(dataWithEmbeddings, "dataWithEmbeddings2.json");
}

// main();
