// scripts/seed_db.ts
import { db, connectToDb } from "../db/surreal.ts";
import { config as _config } from "../config.ts";
import type { FieldOfExpertise, Expert } from "../types/index.ts";

async function seedDatabase() {
  try {
    console.log("Connecting to database for seeding...");
    await connectToDb();
    console.log("Database connection successful.");

    console.log("Reading mock data files...");
    const fieldsJson = await Deno.readTextFile("./data/fields_of_expertise.json");
    const expertsJson = await Deno.readTextFile("./data/experts.json");

    const fieldsData: FieldOfExpertise[] = JSON.parse(fieldsJson);
    const expertsData: Expert[] = JSON.parse(expertsJson);
    console.log(`Read ${fieldsData.length} fields and ${expertsData.length} experts.`);

    console.log("Clearing existing data (optional)...");
    await db.delete("field_of_expertise");
    await db.delete("expert");
    console.log("Existing data cleared.");

    // 4. Seed Fields of Expertise
    console.log("Seeding fields of expertise...");
    for (const field of fieldsData) {
      const { id: _id, ...fieldContent } = field;
      try {
        // --- SOLUTION APPLIED HERE ---
        // 1. REMOVE the generic type argument <FieldOfExpertise> from db.create
        // 2. Keep the assertion on the RESULT
        const createdRecord = await db.create( // No <FieldOfExpertise> here
          "field_of_expertise",
          fieldContent         // Pass the data object directly
        ) as unknown as FieldOfExpertise[]; // Assert the expected return type

        // Accessing the result should still work
        console.log(`  Created field: ${field.name} (ID: ${createdRecord[0]?.id})`);
      } catch (e) {
        console.error(`  Error creating field ${field.name}:`, (e as Error)?.message || String(e));
      }
    }
    console.log("Fields seeding complete.");

    // 5. Seed Experts
    console.log("Seeding experts...");
    for (const expert of expertsData) {
      const { id: _id, ...expertContent } = expert;
      try {
         // --- SOLUTION APPLIED HERE ---
         // 1. REMOVE the generic type argument <Expert> from db.create
         // 2. Keep the assertion on the RESULT
        const createdRecord = await db.create( // No <Expert> here
          "expert",
          expertContent        // Pass the data object directly
        ) as unknown as Expert[]; // Assert the expected return type

        // Accessing the result should still work
        console.log(`  Created expert: ${expert.name} (ID: ${createdRecord[0]?.id})`);
      } catch (e) {
        console.error(`  Error creating expert ${expert.name}:`, (e as Error)?.message || String(e));
      }
    }
    console.log("Experts seeding complete.");

    console.log("Database seeding finished successfully!");

  } catch (error) {
    console.error("Database seeding failed:", error);
  } finally {
    await db.close();
    console.log("Database connection closed.");
  }
}

await seedDatabase();