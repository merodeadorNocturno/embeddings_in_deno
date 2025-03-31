// src/services/google_llm.ts

import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
    GenerateContentResult, // Import this for type safety
  } from "@google/generative-ai";
  import { config } from "../config.ts"; // Your configuration
  import type {
    FieldOfExpertise,
    Expert,
    LlmTopicSuggestion,
    LlmDebateTitleSuggestion,
  } from "../types/index.ts";
  
  // --- Initialize the Google AI Client ---
  let genAI: GoogleGenerativeAI | null = null;
  try {
    genAI = new GoogleGenerativeAI(config.google.apiKey);
    console.log("GoogleGenerativeAI client initialized successfully.");
  } catch (error) {
    console.error("Failed to initialize GoogleGenerativeAI client:", error);
    // Depending on your app's needs, you might want to throw here
    // or handle the lack of 'genAI' in each function call.
  }
  
  // --- Configuration for generation ---
  const generationConfig = {
    // temperature: 0.9, // Example: Adjust creativity (0=deterministic, 1=max creative)
    // topK: 1,          // Example
    // topP: 1,          // Example
    // maxOutputTokens: 2048, // Example: Limit response length
  };
  
  // Safety settings - Adjust as needed based on Google's documentation
  // Blocking potentially harmful content is generally recommended.
  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ];
  
  // --- Helper Function to Extract Text ---
  function extractTextFromResult(result: GenerateContentResult): string | null {
    try {
      // --- Revised Check ---
      // Use optional chaining and check the structure more carefully
      const response = result?.response; // Get the response object safely
  
      if (!response) {
        console.warn("LLM Response object is missing in the result.");
        // Attempt to access feedback if it exists at the top level or within a potential structure
        // Note: The exact location of promptFeedback might vary slightly based on API version or error type.
        // Check the structure of 'result' when you encounter a blocked response during testing.
        const feedback = (result as any)?.promptFeedback ?? (response as any)?.promptFeedback; // Check multiple possible locations using 'any' for flexibility
        if (feedback?.blockReason) {
             console.warn(`Block Reason: ${feedback.blockReason}`);
             // You might log feedback.safetyRatings as well
        }
        return null;
      }
  
      // Check if the function 'text()' exists before calling it
      if (typeof response.text !== 'function') {
          console.warn("LLM response object does not contain a callable 'text' function.");
          // Log the response structure for debugging
          console.warn("Response structure:", JSON.stringify(response, null, 2));
          return null;
      }
  
      const text = response.text(); // Now call text() safely
  
      if (!text && response.candidates?.length) {
          // Sometimes text() might be empty but candidates exist. Check safety ratings there.
           const candidateFeedback = response.candidates[0]?.safetyRatings;
           if(candidateFeedback) {
              console.warn("Response text is empty. Candidate Safety Ratings:", JSON.stringify(candidateFeedback, null, 2));
           } else {
              console.warn("Response text is empty, no candidates or safety ratings found.");
           }
           return null; // Treat empty text as failure unless you decide otherwise
      } else if (!text) {
          console.warn("Response text is empty.");
          return null;
      }
  
  
      return text; // Return the extracted text
  
    } catch (error) {
      // Catch errors during text extraction itself (less likely now with checks)
      console.error("Error processing or extracting text from LLM result:", error);
      // Log the raw result structure for deep debugging if needed
      // console.error("Raw LLM Result:", JSON.stringify(result, null, 2));
      return null;
    }
  }
  
  // --- Helper Function to Parse JSON from Text ---
  // LLMs often return JSON within markdown code blocks ```json ... ```
  function parseJsonFromText<T>(text: string | null): T | null {
      if (!text) return null;
      try {
          // Basic extraction from markdown code blocks
          const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
          const jsonString = jsonMatch ? jsonMatch[1] : text;
  
          return JSON.parse(jsonString) as T;
      } catch (error) {
          console.error("Failed to parse JSON from LLM response:", error);
          console.error("Original text:", text); // Log the problematic text
          return null;
      }
  }
  
  
  // --- API Functions ---
  
  /**
   * Gets innovative essay topic suggestions from the LLM.
   */
  export async function getEssayTopicSuggestions(
    field: FieldOfExpertise,
    expert: Expert
  ): Promise<LlmTopicSuggestion[] | null> {
    if (!genAI) {
      console.error("Google AI client not initialized.");
      return null;
    }
  
    const model = genAI.getGenerativeModel({ model: config.google.llmModel });
  
    // **CRITICAL: Design a good prompt!** This is just an example.
    const prompt = `
      You are an expert academic advisor.
      Generate 3 innovative and specific essay topic suggestions suitable for an undergraduate essay.
      The essay should be within the field of "${field.name}", specifically focusing on the subfield or perspective of "${expert.expertise.subfield}".
      The topics should reflect the likely interests or known viewpoints of an expert like "${expert.name}".
      Consider also their other interests: ${expert.also_interested_in.map(i => `${i.field_name}: ${i.subfield}`).join(', ')}.
  
      Return the suggestions ONLY as a valid JSON array of objects, where each object has the following keys:
      - "topic": A string containing the essay title/topic.
      - "brief_description": A one-sentence description explaining the topic's angle or focus.
  
      Example format:
      \`\`\`json
      [
        { "topic": "Topic 1 Title", "brief_description": "Description 1." },
        { "topic": "Topic 2 Title", "brief_description": "Description 2." },
        { "topic": "Topic 3 Title", "brief_description": "Description 3." }
      ]
      \`\`\`
    `;
  
    console.log(`Requesting essay topics for ${field.name} / ${expert.name}...`);
    try {
      const result = await model.generateContent(prompt/*, generationConfig, safetySettings */); // Add config/safety if needed
      const text = extractTextFromResult(result);
      if (!text) return null;
  
      // Attempt to parse the JSON response
      const suggestions = parseJsonFromText<LlmTopicSuggestion[]>(text);
  
      // Basic validation (check if it's an array)
      if (!Array.isArray(suggestions)) {
          console.error("Parsed response for essay topics is not an array:", suggestions);
          console.error("Original text:", text);
          return null;
      }
  
      console.log(`Received ${suggestions.length} essay topic suggestions.`);
      return suggestions;
  
    } catch (error) {
      console.error("Error getting essay topic suggestions from LLM:", error);
      return null;
    }
  }
  
  /**
   * Gets a debatable topic/title from the LLM for two experts/fields.
   */
  export async function getDebateTopic(
    field1: FieldOfExpertise,
    expert1: Expert,
    field2: FieldOfExpertise,
    expert2: Expert
  ): Promise<LlmDebateTitleSuggestion | null> {
      if (!genAI) {
        console.error("Google AI client not initialized.");
        return null;
      }
  
      const model = genAI.getGenerativeModel({ model: config.google.llmModel });
  
      // **CRITICAL: Design a good prompt!**
      const prompt = `
        Generate a single, compelling, and clearly debatable topic title suitable for an academic debate between two experts.
  
        Expert 1: ${expert1.name}
        Primary Field/Subfield: ${field1.name} / ${expert1.expertise.subfield}
        Other Interests: ${expert1.also_interested_in.map(i => `${i.field_name}: ${i.subfield}`).join(', ') || 'None'}
  
        Expert 2: ${expert2.name}
        Primary Field/Subfield: ${field2.name} / ${expert2.expertise.subfield}
        Other Interests: ${expert2.also_interested_in.map(i => `${i.field_name}: ${i.subfield}`).join(', ') || 'None'}
  
        The debate topic should create interesting friction or contrast between the perspectives likely held by these experts, based on their fields and subfields. The title should be phrased as a question or a provocative statement.
  
        Return the result ONLY as a valid JSON object with the following keys:
        - "title": A string containing the debate title.
        - "perspective_1_summary": A brief (one-sentence) summary of the likely stance or key argument from ${expert1.name}'s perspective.
        - "perspective_2_summary": A brief (one-sentence) summary of the likely stance or key argument from ${expert2.name}'s perspective.
  
        Example format:
        \`\`\`json
        {
          "title": "Is [Concept A from Field 1] fundamentally incompatible with [Concept B from Field 2]?",
          "perspective_1_summary": "${expert1.name} would likely argue that...",
          "perspective_2_summary": "${expert2.name} would likely emphasize that..."
        }
        \`\`\`
      `;
  
      console.log(`Requesting debate topic for ${expert1.name} vs ${expert2.name}...`);
      try {
        const result = await model.generateContent(prompt);
        const text = extractTextFromResult(result);
        if (!text) return null;
  
        const debateTitle = parseJsonFromText<LlmDebateTitleSuggestion>(text);
  
        // Basic validation (check if it has a title property)
        if (!debateTitle?.title) {
            console.error("Parsed response for debate topic lacks a title:", debateTitle);
            console.error("Original text:", text);
            return null;
        }
  
        console.log(`Received debate title: ${debateTitle.title}`);
        return debateTitle;
  
      } catch (error) {
        console.error("Error getting debate topic from LLM:", error);
        return null;
      }
  }
  
  /**
   * Generates the full text of an essay based on a topic, field, and expert.
   */
  export async function generateEssay(
    topic: string,
    field: FieldOfExpertise,
    expert: Expert
  ): Promise<string | null> {
      if (!genAI) {
        console.error("Google AI client not initialized.");
        return null;
      }
  
      const model = genAI.getGenerativeModel({ model: config.google.llmModel });
  
      // **CRITICAL: Design a good prompt!**
      const prompt = `
        You are tasked with writing an academic essay.
        Emulate the style, tone, and likely perspective of "${expert.name}", an expert in "${field.name}", specifically focusing on "${expert.expertise.subfield}".
        Consider also their other interests: ${expert.also_interested_in.map(i => `${i.field_name}: ${i.subfield}`).join(', ')}.
  
        The essay topic is: "${topic}"
  
        Write a coherent and well-structured essay of approximately 500-700 words addressing this topic from the specified perspective.
        Ensure the arguments are consistent with the known ideas or school of thought associated with ${expert.name} and ${expert.expertise.subfield}.
        Structure the essay with an introduction, body paragraphs with supporting points, and a conclusion.
  
        Do not include any introductory remarks like "Certainly, here is the essay:" or similar meta-commentary.
        Output only the raw text of the essay itself.
      `;
  
      console.log(`Generating essay on "${topic}" from ${expert.name}'s perspective...`);
      try {
        const result = await model.generateContent(prompt);
        const essayText = extractTextFromResult(result);
  
        if (essayText && essayText.length > 50) { // Basic check for non-trivial content
          console.log(`Generated essay successfully (Length: ${essayText.length}).`);
        } else if (essayText) {
           console.warn(`Generated essay seems very short (Length: ${essayText.length}). Might be an issue.`);
        } else {
           console.error("Failed to generate essay text or received empty/blocked response.");
           return null;
        }
        return essayText;
  
      } catch (error) {
        console.error("Error generating essay from LLM:", error);
        return null;
      }
  }
  
  
  /**
   * Generates the full text of a debate based on a title and two experts/fields.
   */
  export async function generateDebate(
    title: string,
    field1: FieldOfExpertise,
    expert1: Expert,
    field2: FieldOfExpertise,
    expert2: Expert
  ): Promise<string | null> {
      if (!genAI) {
        console.error("Google AI client not initialized.");
        return null;
      }
  
      const model = genAI.getGenerativeModel({ model: config.google.llmModel });
  
      // **CRITICAL: Design a good prompt!**
      const prompt = `
        You are an academic moderator and writer.
        Construct the text for a structured debate based on the following title: "${title}"
  
        The debate features two opposing viewpoints:
  
        Perspective 1: Represented by "${expert1.name}", arguing from the perspective of "${field1.name}" / "${expert1.expertise.subfield}".
        Perspective 2: Represented by "${expert2.name}", arguing from the perspective of "${field2.name}" / "${expert2.expertise.subfield}".
  
        Structure the debate text as follows:
        1.  **Introduction:** Briefly introduce the debate topic "${title}" and the two expert perspectives.
        2.  **Arguments for Perspective 1 (${expert1.name}):** Present 2-3 key arguments supporting this side, consistent with ${expert1.name}'s field/subfield.
        3.  **Arguments for Perspective 2 (${expert2.name}):** Present 2-3 key arguments supporting this side, consistent with ${expert2.name}'s field/subfield.
        4.  **(Optional) Rebuttals:** Briefly outline potential rebuttals each side might make to the other.
        5.  **Conclusion:** Summarize the main points of contention and offer a concluding thought on the complexity of the issue.
  
        The total length should be approximately 600-800 words.
        Maintain an academic tone. Ensure the arguments for each side are distinct and genuinely reflect the likely stance derived from their respective fields/subfields.
  
        Do not include any introductory remarks like "Certainly, here is the debate script:" or similar meta-commentary.
        Output only the raw text of the debate itself.
      `;
  
      console.log(`Generating debate for "${title}" (${expert1.name} vs ${expert2.name})...`);
       try {
        const result = await model.generateContent(prompt);
        const debateText = extractTextFromResult(result);
  
        if (debateText && debateText.length > 50) { // Basic check
          console.log(`Generated debate successfully (Length: ${debateText.length}).`);
        } else if (debateText) {
           console.warn(`Generated debate seems very short (Length: ${debateText.length}). Might be an issue.`);
        } else {
           console.error("Failed to generate debate text or received empty/blocked response.");
           return null;
        }
        return debateText;
  
      } catch (error) {
        console.error("Error generating debate from LLM:", error);
        return null;
      }
  }