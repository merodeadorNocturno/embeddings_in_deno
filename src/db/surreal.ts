// src/db/surreal.ts (showing relevant updates)
import { Surreal } from "@surrealdb/surrealdb";
import { config } from "../config.ts"; // Import the loaded config
import type {
  Credentials,
  DatabaseScope,
  EndpointConfig,
  ConnectionConfig, // Make sure these are exported if defined here
  SurrealQueryResult,
} from "../types/db_types.ts"; // Or define them here and export
import type { FieldOfExpertise, Expert } from "../types/index.ts"; // Import data types

// Define/Export ConnectionConfig related interfaces if not in a separate file
export { Credentials, DatabaseScope, EndpointConfig, ConnectionConfig };

export const db = new Surreal();
console.log("SurrealDB instance created.");

// ... (rest of connectToDb function using updated interfaces like user/pass) ...
// Use the imported config object inside connectToDb or pass it in
export async function connectToDb(): Promise<Surreal> { // Simplified: Assumes config is available via import
    const connConfig: ConnectionConfig = {
        credentials: config.surreal.credentials,
        scope: config.surreal.scope,
        endpoint: config.surreal.endpoint,
    };

    const { credentials, scope, endpoint } = connConfig;

    const connectionUrl = `${endpoint.protocol}://${endpoint.host}${
      endpoint.port ? ":" + endpoint.port : ""
    }/rpc`;

    console.log(`Attempting to connect to SurrealDB at ${connectionUrl}...`);
    await db.connect(connectionUrl);
    console.log("Connection established.");

    console.log(
      `Using namespace: ${scope.namespace}, database: ${scope.database}...`
    );
    await db.use({
      namespace: scope.namespace,
      database: scope.database,
    });
    console.log("Namespace and database selected.");

    console.log(`Signing in as user: ${credentials.username}...`);
    await db.signin({
      username: credentials.username,
      password: credentials.password,
    });
    console.log("Sign-in successful.");

    return db;
  }

// --- Data Operation Functions (Implementation Drafts) ---

export async function getAllFieldsOfExpertise(): Promise<FieldOfExpertise[]> {
  console.log("Fetching all fields of expertise using db.query (Corrected Type)...");
  const query = "SELECT * FROM field_of_expertise;";
  try {
      // Correct Type Argument: An array containing ONE SurrealQueryResult
      // where the 'result' property holds an array of FieldOfExpertise
      const results = await db.query<[SurrealQueryResult<FieldOfExpertise[]>]>(query);

      // Explanation:
      // results                -> Is now typed as [SurrealQueryResult<FieldOfExpertise[]>] | undefined (or similar based on lib)
      // results[0]             -> Is SurrealQueryResult<FieldOfExpertise[]> | undefined
      // results[0]?.result     -> Is FieldOfExpertise[] | undefined
      const fields = results[0]?.result ?? []; // This should now work correctly

      console.log(`Found ${fields.length} fields.`);
      return fields;
  } catch (error) {
      console.error("Error fetching fields of expertise:", error);
      return [];
  }
}

export async function getExpertsByFieldName(fieldName: string): Promise<Expert[]> {
  console.log(`Fetching experts for field: ${fieldName} using db.query (Corrected Type)...`);
  const query = 'SELECT * FROM expert WHERE expertise.field_name = $name;';
  try {
      // Correct Type Argument: Array containing ONE SurrealQueryResult<Expert[]>
      const results = await db.query<[SurrealQueryResult<Expert[]>]>(query, { name: fieldName });
      const experts = results[0]?.result ?? []; // Access result property
      console.log(`Found ${experts.length} experts for field ${fieldName}.`);
      return experts;
  } catch (error) {
      console.error(`Error fetching experts for field ${fieldName}:`, error);
      return [];
  }
}

// Add functions for saveGeneratedContent, updateContentEmbedding etc. later