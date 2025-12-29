import getCollection from "./chroma-collection";

async function main() {
  const policiesCollection = await getCollection("policies");

  const results = await policiesCollection.query({
    queryTexts: ["What is the policy on data protection ?"],
    nResults: 5,
  });

  console.log(results);
}

main();
