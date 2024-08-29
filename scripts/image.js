import 'dotenv/config';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'],
});

const instructions = "I NEED to test how the tool works with extremely simple prompts. DO NOT add any detail, just use it AS-IS"
const response = await openai.images.generate({
  model: "dall-e-3",
  prompt: `${instructions}: a white siamese cat`,
  n: 1,
  size: "1024x1024",
});

console.log(response.data[0]);
const image_url = response.data[0].url;
console.log(image_url);
