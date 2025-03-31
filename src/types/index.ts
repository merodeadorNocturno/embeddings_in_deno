// src/types/index.ts

/**
 * Represents a specific area of knowledge.
 * Recommendation: Use this structured format for easier querying and type safety,
 * rather than the dynamic key format like { psychology: [...] }.
 * Corresponds to Requirement DR-Model-01.
 */
export interface FieldOfExpertise {
    id?: string; // Optional: SurrealDB Record ID (e.g., "field_of_expertise:psychology")
    name: string; // The main field name, e.g., "psychology", "philosophy"
    subfields: string[]; // List of subfield names, e.g., ["Cognitive Psychology", "Ethics"]
  }
  
  // --- Alternative for FieldOfExpertise (Based on original example, less recommended for DB) ---
  // If you strictly wanted to follow the initial example [{ psychology: [...] }, ... ]
  // export interface FieldOfExpertiseMap {
  //   [fieldName: string]: string[]; // Dynamic key representing the field name
  // }
  // export type FieldsOfExpertiseList = FieldOfExpertiseMap[];
  // --- End Alternative ---
  
  
  /**
   * Represents a reference to a specific expertise (Field + Subfield).
   * Used within the Expert interface for better structure and potential linking.
   */
  export interface ExpertiseRef {
    field_name: string; // References FieldOfExpertise.name, e.g., "psychology"
    subfield: string;   // References a value within FieldOfExpertise.subfields, e.g., "Cognitive Psychology"
    // Consider using field_id (Record Link) if using SurrealDB relations:
    // field_id: string; // e.g., "field_of_expertise:psychology"
  }
  
  /**
   * Represents an expert with their primary field and other interests.
   * Corresponds to Requirement DR-Model-02.
   */
  export interface Expert {
    id?: string; // Optional: SurrealDB Record ID (e.g., "expert:uuid_or_name")
    name: string;
    expertise: ExpertiseRef; // Primary area of expertise
    also_interested_in: ExpertiseRef[]; // Other areas of interest
  }
  
  /**
   * Represents the final generated content (Essay or Debate) stored in the database.
   * Corresponds to Requirement DR-Model-03.
   */
  export interface GeneratedContent {
    id?: string; // Optional: SurrealDB Record ID (e.g., "generated_content:uuid")
    type: 'Essay' | 'Debate'; // Type of content generated
    title_or_topic: string; // The specific topic/title given by the LLM or chosen
    content: string; // The main body of the generated text
    primary_field_name: string; // Name of the primary field used (references FieldOfExpertise.name)
    primary_expert_name: string; // Name of the primary expert involved (references Expert.name)
    secondary_field_name: string | null; // Name of the secondary field (only for 'Debate', null otherwise)
    secondary_expert_name: string | null; // Name of the secondary expert (only for 'Debate', null otherwise)
    created_at: string; // Timestamp when the content was generated (e.g., ISO 8601 format)
    vector_embedding?: number[]; // The vector embedding of the 'content' (added in a later step)
    // Consider using Record Links for fields/experts for stronger relationships:
    // primary_field_id?: string; // e.g. "field_of_expertise:psychology"
    // primary_expert_id?: string; // e.g. "expert:uuid_or_name"
    // secondary_field_id?: string | null;
    // secondary_expert_id?: string | null;
  }
  
  /**
   * Represents the structure expected from the LLM when asking for essay topic suggestions.
   * (Helper type - adjust based on how you prompt the LLM).
   */
  export interface LlmTopicSuggestion {
      topic: string;
      brief_description?: string; // Optional: A short explanation
  }
  
  /**
   * Represents the structure expected from the LLM when asking for a debate topic/title.
   * (Helper type - adjust based on how you prompt the LLM).
   */
  export interface LlmDebateTitleSuggestion {
      title: string;
      perspective_1_summary?: string; // Optional: Hint for expert 1's angle
      perspective_2_summary?: string; // Optional: Hint for expert 2's angle
  }