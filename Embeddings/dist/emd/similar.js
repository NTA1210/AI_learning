"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cosineSimilarity = cosineSimilarity;
const _1 = require(".");
function dotProduct(a, b) {
    return a
        .map((value, index) => value * b[index])
        .reduce((acc, curr) => acc + curr, 0);
}
function cosineSimilarity(a, b) {
    const product = dotProduct(a, b);
    const aMagnitude = Math.sqrt(a.map((value) => value * value).reduce((acc, curr) => acc + curr, 0));
    const bMagnitude = Math.sqrt(b.map((value) => value * value).reduce((acc, curr) => acc + curr, 0));
    return product / (aMagnitude * bMagnitude);
}
async function main() {
    const dataWithEmbeddings = (0, _1.loadJSONData)("dataWithEmbeddings2.json");
    const input = "How old is John ?";
    const inputEmbedding = await (0, _1.generateEmbedding)(input);
    const similarities = [];
    for (const entry of dataWithEmbeddings) {
        const similarity = cosineSimilarity(entry.embedding, inputEmbedding.data[0].embedding);
        similarities.push({ input: entry.input, similarity });
    }
    console.log(`Similarity of ${input} with:`);
    const sortedSimilarities = similarities.sort((a, b) => b.similarity - a.similarity);
    sortedSimilarities.forEach((similarity) => {
        console.log(`${similarity.input}: ${similarity.similarity}`);
    });
}
// main();
