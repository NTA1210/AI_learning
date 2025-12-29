"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const __1 = require("..");
const fs_2 = __importDefault(require("fs"));
const similar_1 = require("../similar");
async function getMovieEmbedding() {
    const fileName = "movieEmbeddings.json";
    const filePath = path_1.default.join(__dirname, fileName);
    if ((0, fs_1.existsSync)(filePath)) {
        const rawData = loadJSONData(fileName);
        return rawData;
    }
    else {
        const movies = loadJSONData("movie.json");
        const embeddings = await (0, __1.generateEmbedding)(movies.map((movie) => movie.description));
        const movieEmbeddings = movies.map((movie, index) => ({
            name: movie.name,
            embedding: embeddings.data[index].embedding,
        }));
        saveDataToJsonFile(movieEmbeddings, "movieEmbeddings.json");
        return movieEmbeddings;
    }
}
function loadJSONData(fileName) {
    const filePath = path_1.default.join(__dirname, fileName);
    const rawData = fs_2.default.readFileSync(filePath, "utf-8");
    return JSON.parse(rawData);
}
function saveDataToJsonFile(data, fileName) {
    const dataString = JSON.stringify(data, null, 2);
    const dataBuffer = Buffer.from(dataString, "utf-8");
    const filePath = path_1.default.join(__dirname, fileName);
    fs_2.default.writeFileSync(filePath, dataBuffer);
    console.log(`saved data to ${fileName}`);
}
async function recommendMovies(input) {
    const inputEmbedding = await (0, __1.generateEmbedding)(input);
    const movieEmbeddings = await getMovieEmbedding();
    const similarities = [];
    for (const movie of movieEmbeddings) {
        const similarity = (0, similar_1.cosineSimilarity)(movie.embedding, inputEmbedding.data[0].embedding);
        similarities.push({ name: movie.name, similarity });
    }
    console.log(`If you like ${input}, we recommend:`);
    console.log("...............");
    const sortedSimilarities = similarities.sort((a, b) => b.similarity - a.similarity);
    sortedSimilarities.forEach((similarity) => {
        console.log(`${similarity.name}: ${similarity.similarity}`);
    });
}
console.log("What movies do you like?");
console.log("...............");
process.stdin.addListener("data", async function (input) {
    let userInput = input.toString().trim();
    await recommendMovies(userInput);
});
