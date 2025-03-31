import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: Deno.env.get('GOOGLE_API_KEY') || '' });

export async function createEmbedding(text_to_embed: string) {
  const vector = await ai.models.embedContent({
    model: Deno.env.get('GOOGLE_EMBEDDING_MODEL') || 'textembedding-gecko',
    contents: text_to_embed,
    config: {outputDimensionality: 128},
  });

  return vector.embeddings;
}