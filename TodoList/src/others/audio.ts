import OpenAI from "openai";
import { writeFileSync, createReadStream } from "node:fs";
import dotenv from "dotenv";

dotenv.config();

const openAi = new OpenAI();

async function createTranscription() {
  const response = await openAi.audio.transcriptions.create({
    file: createReadStream("audios/voice.mp3"),
    model: "whisper-1",
    language: "en",
    timestamp_granularities: ["word"],
    response_format: "verbose_json",
  });
  console.log(response);
}

async function translate() {
  const response = await openAi.audio.translations.create({
    file: createReadStream("audios/voice.mp3"),
    model: "whisper-1",
  });
  console.log(response);
}

async function textToSpeech() {
  const response = await openAi.audio.speech.create({
    input: "Today is a wonderful day to build something people love!",
    model: "tts-1",
    voice: "coral",
    instructions: "Make it fun",
    response_format: "mp3",
  });
  const buffer = Buffer.from(await response.arrayBuffer());

  writeFileSync("audios/output.mp3", buffer);
}

// createTranscription();
textToSpeech();
