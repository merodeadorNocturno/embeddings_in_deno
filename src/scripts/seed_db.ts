// scripts/seed_db.ts
import { db, connectToDb } from "../db/surreal.ts"; // Import instance and connection function
import { config } from "../config.ts"; // Import config to ensure env vars are loaded if needed elsewhere
import type { FieldOfExpertise, Expert } from "../types/index.ts";

async function seedDatabase() {
  try {
    // 1. Connect to the database
    console.log("Connecting to database for seeding...");
    await connectToDb(); // Assumes connectToDb uses the imported config
    console.log("Database connection successful.");

    // 2. Read and Parse Mock Data
    console.log("Reading mock data files...");
    const fieldsJson = await Deno.readTextFile("./data/fields_of_expertise.json");
    const expertsJson = await Deno.readTextFile("./data/experts.json");

    const fieldsData: FieldOfExpertise[] = JSON.parse(fieldsJson);
    const expertsData: Expert[] = JSON.parse(expertsJson);
    console.log(`Read ${fieldsData.length} fields and ${expertsData.length} experts.`);

    // 3. Clear existing data (Optional - good for repeatable seeding)
    console.log("Clearing existing data (optional)...");
    // Use DELETE instead of DROP TABLE if tables have schema definitions you want to keep
    await db.delete("field_of_expertise");
    await db.delete("expert");
    // Add other tables if needed: await db.delete("generated_content");
    console.log("Existing data cleared.");


    // 4. Seed Fields of Expertise
    console.log("Seeding fields of expertise...");
    for (const field of fieldsData) {
      // Decide whether to use the ID from JSON or let SurrealDB generate one
      // If using JSON ID: Ensure it's unique and in format 'table:id'
      // If letting DB generate: Omit 'id' field before creating
      const { id, ...fieldContent } = field; // Separate ID if provided
      try {
         // Use db.create() which is often simpler for single records
         // If using ID from JSON: await db.create(field.id, fieldContent);
         // If letting DB generate ID:
         const createdRecord = await db.create<FieldOfExpertise>("field_of_expertise", fieldContent);
         console.log(`  Created field: ${field.name} (ID: ${createdRecord[0]?.id})`);
      } catch (e) {
          console.error(`  Error creating field ${field.name}:`, e.message);
      }
    }
    console.log("Fields seeding complete.");

    // 5. Seed Experts
    console.log("Seeding experts...");
    for (const expert of expertsData) {
       const { id, ...expertContent } = expert;
       try {
          // If using ID from JSON: await db.create(expert.id, expertContent);
          // If letting DB generate ID:
          const createdRecord = await db.create<Expert>("expert", expertContent);
          console.log(`  Created expert: ${expert.name} (ID: ${createdRecord[0]?.id})`);
       } catch(e) {
           console.error(`  Error creating expert ${expert.name}:`, e.message);
       }

    }
    console.log("Experts seeding complete.");

    console.log("Database seeding finished successfully!");

  } catch (error) {
    console.error("Database seeding failed:", error);
  } finally {
    // Close the database connection
    await db.close();
    console.log("Database connection closed.");
  }
}

// Run the seeding function
await seedDatabase();