"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const chroma_collection_1 = __importDefault(require("./chroma-collection"));
const filePath = path_1.default.join(__dirname, "policies.txt");
const policies = (0, fs_1.readFileSync)(filePath, "utf-8").split("\n").filter(Boolean);
async function main() {
    const policiesCollection = await (0, chroma_collection_1.default)("policies");
    await policiesCollection.add({
        documents: policies,
        ids: policies.map(() => crypto.randomUUID()),
        metadatas: policies.map((_, index) => ({ line: index.toString() })),
    });
    console.log(await policiesCollection.peek({}));
}
main();
