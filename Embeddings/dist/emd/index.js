"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateEmbedding = generateEmbedding;
exports.loadJSONData = loadJSONData;
exports.saveDataToJsonFile = saveDataToJsonFile;
const openai_1 = __importDefault(require("openai"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
dotenv_1.default.config();
const openAI = new openai_1.default();
async function generateEmbedding(input) {
    const response = await openAI.embeddings.create({
        input,
        model: "text-embedding-3-small",
    });
    console.log(response);
    return response;
}
function loadJSONData(fileName) {
    const filePath = path_1.default.join(__dirname, fileName);
    const rawData = fs_1.default.readFileSync(filePath, "utf-8");
    return JSON.parse(rawData);
}
function saveDataToJsonFile(data, fileName) {
    const dataString = JSON.stringify(data, null, 2);
    const dataBuffer = Buffer.from(dataString, "utf-8");
    const filePath = path_1.default.join(__dirname, fileName);
    fs_1.default.writeFileSync(filePath, dataBuffer);
    console.log(`saved data to ${fileName}`);
}
// generateEmbedding([
//   "Dog is sleeping under the tree",
//   "Cat is sleeping on the couch",
// ]);
async function main() {
    const data = loadJSONData("data2.json");
    const embeddings = await generateEmbedding(data);
    const dataWithEmbeddings = [];
    for (let i = 0; i < data.length; i++) {
        dataWithEmbeddings.push({
            input: data[i],
            embedding: embeddings.data[i].embedding,
        });
    }
    saveDataToJsonFile(dataWithEmbeddings, "dataWithEmbeddings2.json");
}
// main();
