import { CloudClient } from "chromadb";
import { OpenAIEmbeddingFunction } from "@chroma-core/openai";
import dotenv from "dotenv";

dotenv.config();

const client = new CloudClient({
  apiKey: process.env.CHROMA_API_KEY,
  tenant: "5c0c796d-804f-4d27-a3cb-8849de14fed4",
  database: "my-chroma-db",
});

const getCollection = async (collectionName: string) => {
  const collection = await client.getOrCreateCollection({
    name: collectionName,
    embeddingFunction: new OpenAIEmbeddingFunction({
      modelName: "text-embedding-3-small",
    }),
  });
  console.log(collection);

  return collection;
};

// getCollection("test");

export default getCollection;
