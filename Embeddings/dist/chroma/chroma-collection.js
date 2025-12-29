"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chromadb_1 = require("chromadb");
const openai_1 = require("@chroma-core/openai");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const client = new chromadb_1.CloudClient({
    apiKey: process.env.CHROMA_API_KEY,
    tenant: "5c0c796d-804f-4d27-a3cb-8849de14fed4",
    database: "my-chroma-db",
});
const getCollection = async (collectionName) => {
    const collection = await client.getOrCreateCollection({
        name: collectionName,
        embeddingFunction: new openai_1.OpenAIEmbeddingFunction({
            modelName: "text-embedding-3-small",
        }),
    });
    console.log(collection);
    return collection;
};
// getCollection("test");
exports.default = getCollection;
