import OpenAI, { toFile } from "openai";
import dotenv from "dotenv";
import { readFile, writeFile } from "node:fs/promises";
import { createReadStream } from "node:fs";
import { base64 } from "zod";

dotenv.config();

export const openai = new OpenAI();

async function generateImage() {
  const response = await openai.images.generate({
    prompt: "A cute baby sea otter",
    model: "dall-e-2",
    size: "512x512",
    response_format: "b64_json",
  });

  console.log(response);
  const rawImage = response?.data![0]?.b64_json;
  if (rawImage) {
    writeFile("images/image.png", Buffer.from(rawImage, "base64"), "binary");
  }
}
async function generateAdvancedImage() {
  const response = await openai.images.generate({
    prompt: "Photo of a city at night with skyscrapers",
    model: "dall-e-3",
    quality: "hd",
    size: "1024x1024",
    response_format: "b64_json",
  });

  console.log(response);
  const rawImage = response?.data![0]?.b64_json;
  if (rawImage) {
    writeFile("images/city.png", Buffer.from(rawImage, "base64"), "binary");
  }
}

async function generateImageVariation() {
  const response = await openai.images.createVariation({
    image: createReadStream("images/city.png"),
    response_format: "b64_json",
  });
  console.log(response);

  const rawImage = response.data![0].b64_json;
  if (rawImage) {
    writeFile(
      "images/cityVariation.png",
      Buffer.from(rawImage, "base64"),
      "binary"
    );
  }
}

async function editImage() {
  const image = await toFile(createReadStream("images/city.png"), null, {
    type: "image/png",
  });

  const response = await openai.images.edit({
    image: image,
    // mask: image, //provide a mask to indicate which part of the image should be edited.
    model: "dall-e-2",
    prompt: "add a thunderstorm to the city",
    response_format: "b64_json",
  });
  console.log(response);

  const rawImage = response.data![0].b64_json;
  if (rawImage) {
    writeFile(
      "images/cityEdited.png",
      Buffer.from(rawImage, "base64"),
      "binary"
    );
  }
}

// generateImage();
// generateAdvancedImage();
// generateImageVariation();
editImage();
