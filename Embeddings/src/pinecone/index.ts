import { Pinecone } from "@pinecone-database/pinecone";
import dotenv from "dotenv";

dotenv.config();

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY as string,
});

//Namespaces let you partition an index into groupings for multi-tenancy or query speed.
async function createNamespace() {
  const index = getIndex();
  const namespace = index.namespace("my-namespace");
}

function getIndex() {
  const index = pc.index("content-index");
  return index;
}

async function listIndexes() {
  const result = await pc.listIndexes();
  console.log(result);
}

async function createIndex() {
  await pc.createIndex({
    name: "content-index",
    dimension: 1536,
    metric: "cosine",
    spec: {
      serverless: {
        cloud: "aws",
        region: "us-east-1",
      },
    },
  });
}

async function main() {
  await listIndexes();
}

main();
