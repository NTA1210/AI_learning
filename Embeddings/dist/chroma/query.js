"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chroma_collection_1 = __importDefault(require("./chroma-collection"));
async function main() {
    const policiesCollection = await (0, chroma_collection_1.default)("policies");
    const results = await policiesCollection.query({
        queryTexts: ["What is the policy on data protection ?"],
        nResults: 5,
    });
    console.log(results);
}
main();
