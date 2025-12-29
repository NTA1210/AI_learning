import { readFileSync } from "fs";
import path from "path";
import getCollection from "./chroma-collection";

const filePath = path.join(__dirname, "policies.txt");

const policies = readFileSync(filePath, "utf-8").split("\n").filter(Boolean);

async function main() {
  const policiesCollection = await getCollection("policies");

  await policiesCollection.add({
    documents: policies,
    ids: policies.map(() => crypto.randomUUID()),
    metadatas: policies.map((_, index) => ({ line: index.toString() })),
  });

  console.log(await policiesCollection.peek({}));
}

main();
