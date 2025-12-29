import { existsSync } from "fs";
import path from "path";
import { generateEmbedding } from "..";
import fs from "fs";
import { cosineSimilarity } from "../similar";

type MovieEmbedding = {
  name: string;
  embedding: number[];
};

type Movie = {
  name: string;
  description: string;
};

type Similarity = {
  name: string;
  similarity: number;
};

async function getMovieEmbedding() {
  const fileName = "movieEmbeddings.json";
  const filePath = path.join(__dirname, fileName);
  if (existsSync(filePath)) {
    const rawData = loadJSONData<MovieEmbedding[]>(fileName);
    return rawData;
  } else {
    const movies = loadJSONData<Movie[]>("movie.json");
    const embeddings = await generateEmbedding(
      movies.map((movie) => movie.description)
    );

    const movieEmbeddings = movies.map((movie, index) => ({
      name: movie.name,
      embedding: embeddings.data[index].embedding,
    }));
    saveDataToJsonFile(movieEmbeddings, "movieEmbeddings.json");
    return movieEmbeddings;
  }
}

function loadJSONData<T>(fileName: string): T {
  const filePath = path.join(__dirname, fileName);
  const rawData = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(rawData) as T;
}

function saveDataToJsonFile(data: any, fileName: string) {
  const dataString = JSON.stringify(data, null, 2);
  const dataBuffer = Buffer.from(dataString, "utf-8");
  const filePath = path.join(__dirname, fileName);
  fs.writeFileSync(filePath, dataBuffer);
  console.log(`saved data to ${fileName}`);
}

async function recommendMovies(input: string) {
  const inputEmbedding = await generateEmbedding(input);

  const movieEmbeddings = await getMovieEmbedding();

  const similarities: Similarity[] = [];

  for (const movie of movieEmbeddings) {
    const similarity = cosineSimilarity(
      movie.embedding,
      inputEmbedding.data[0].embedding
    );
    similarities.push({ name: movie.name, similarity });
  }
  console.log(`If you like ${input}, we recommend:`);
  console.log("...............");
  const sortedSimilarities = similarities.sort(
    (a, b) => b.similarity - a.similarity
  );
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
