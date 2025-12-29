"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pinecone_1 = require("@pinecone-database/pinecone");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const pc = new pinecone_1.Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
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
