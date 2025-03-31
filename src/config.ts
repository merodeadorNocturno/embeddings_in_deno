// src/config.ts
import { load } from "jsr:@std/dotenv"; // Use the latest compatible std version

// Load environment variables from .env file
// Returns an object with the environment variables. Fails silently if .env not found.
const _env = await load({ export: true }); // Use export: true to put them into Deno.env directly

// Function to get required environment variable or throw error
function getRequiredEnv(key: string): string {
  const value = Deno.env.get(key);
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

// Define your application configuration
export const config = {
  google: {
    apiKey: getRequiredEnv("GOOGLE_API_KEY"),
    // Add other Google-related configs if needed (e.g., specific model names)
    llmModel: Deno.env.get("GOOGLE_LLM_MODEL") || "gemini-pro", // Example default
    embeddingModel: Deno.env.get("GOOGLE_EMBEDDING_MODEL") || "text-embedding-004", // Example default
  },
  surreal: {
    endpoint: {
      protocol: (Deno.env.get("SURREALDB_PROTOCOL") || "ws") as | "ws" | "wss" | "http" | "https",
      host: getRequiredEnv("SURREALDB_HOST"), // Use HOST instead of URL
      port: Deno.env.get("SURREALDB_PORT")
        ? parseInt(Deno.env.get("SURREALDB_PORT")!, 10)
        : undefined,
    },
    scope: {
      namespace: getRequiredEnv("SURREALDB_NS"),
      database: getRequiredEnv("SURREALDB_DB"),
    },
    credentials: {
      username: getRequiredEnv("SURREALDB_USER"),
      password: getRequiredEnv("SURREALDB_PASS"),
    },
  },
  // Add other app configurations here
} as const; // Use 'as const' for stricter typing

console.log("Configuration loaded.");

// Update your .env file accordingly
/*
# .env example
GOOGLE_API_KEY=your_google_api_key
# GOOGLE_LLM_MODEL=gemini-pro
# GOOGLE_EMBEDDING_MODEL=text-embedding-004

SURREALDB_HOST=localhost # Or your DB host
SURREALDB_PORT=8000
SURREALDB_PROTOCOL=ws # ws/wss/http/https
SURREALDB_USER=root
SURREALDB_PASS=root
SURREALDB_NS=test
SURREALDB_DB=test
*/