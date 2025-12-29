import { DataWithEmbeddings, generateEmbedding, loadJSONData } from ".";

function dotProduct(a: number[], b: number[]): number {
  return a
    .map((value, index) => value * b[index])
    .reduce((acc, curr) => acc + curr, 0);
}

export function cosineSimilarity(a: number[], b: number[]): number {
  const product = dotProduct(a, b);
  const aMagnitude = Math.sqrt(
    a.map((value) => value * value).reduce((acc, curr) => acc + curr, 0)
  );
  const bMagnitude = Math.sqrt(
    b.map((value) => value * value).reduce((acc, curr) => acc + curr, 0)
  );

  return product / (aMagnitude * bMagnitude);
}

async function main() {
  const dataWithEmbeddings = loadJSONData<DataWithEmbeddings[]>(
    "dataWithEmbeddings2.json"
  );

  const input = "How old is John ?";
  const inputEmbedding = await generateEmbedding(input);

  const similarities: {
    input: string;
    similarity: number;
  }[] = [];

  for (const entry of dataWithEmbeddings) {
    const similarity = cosineSimilarity(
      entry.embedding,
      inputEmbedding.data[0].embedding
    );
    similarities.push({ input: entry.input, similarity });
  }

  console.log(`Similarity of ${input} with:`);
  const sortedSimilarities = similarities.sort(
    (a, b) => b.similarity - a.similarity
  );
  sortedSimilarities.forEach((similarity) => {
    console.log(`${similarity.input}: ${similarity.similarity}`);
  });
}

// main();
