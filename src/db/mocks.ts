export const experts = [
    {
      "id": "expert:carl_jung",
      "name": "Carl Jung",
      "expertise": {
        "field_name": "psychology",
        "subfield": "Psychoanalysis"
      },
      "also_interested_in": [
        {
          "field_name": "philosophy",
          "subfield": "Metaphysics"
        },
        {
          "field_name": "theology",
          "subfield": "Comparative Religion"
        }
      ]
    },
    {
      "id": "expert:simone_de_beauvoir",
      "name": "Simone de Beauvoir",
      "expertise": {
        "field_name": "philosophy",
        "subfield": "Existentialism"
      },
      "also_interested_in": [
        {
          "field_name": "literature",
          "subfield": "Narrative Theory"
        },
        {
          "field_name": "psychology",
          "subfield": "Social Psychology"
        }
      ]
    },
    {
      "id": "expert:maya_deren",
      "name": "Maya Deren",
      "expertise": {
        "field_name": "cinematography",
        "subfield": "Framing and Composition"
      },
      "also_interested_in": [
        {
          "field_name": "music",
          "subfield": "Ethnomusicology"
        }
      ]
    },
    {
      "id": "expert:thomas_aquinas",
      "name": "Thomas Aquinas",
      "expertise": {
        "field_name": "theology",
        "subfield": "Systematic Theology"
      },
      "also_interested_in": [
        {
          "field_name": "philosophy",
          "subfield": "Metaphysics"
        }
      ]
    },
      {
      "id": "expert:judith_butler",
      "name": "Judith Butler",
      "expertise": {
        "field_name": "philosophy",
        "subfield": "Political Philosophy"
      },
      "also_interested_in": [
        {
          "field_name": "literature",
          "subfield": "Literary Theory"
        },
         {
          "field_name": "psychology",
          "subfield": "Psychoanalysis"
        }
      ]
    }
  ];

  export const fields_of_expertise = [
    {
      "id": "field_of_expertise:psychology",
      "name": "psychology",
      "subfields": [
        "Cognitive Psychology",
        "Social Psychology",
        "Developmental Psychology",
        "Clinical Psychology",
        "Psychoanalysis"
      ]
    },
    {
      "id": "field_of_expertise:philosophy",
      "name": "philosophy",
      "subfields": [
        "Metaphysics",
        "Epistemology",
        "Ethics",
        "Political Philosophy",
        "Existentialism",
        "Philosophy of Mind"
      ]
    },
    {
      "id": "field_of_expertise:theology",
      "name": "theology",
      "subfields": [
        "Systematic Theology",
        "Biblical Studies",
        "Historical Theology",
        "Practical Theology",
        "Comparative Religion"
      ]
    },
    {
      "id": "field_of_expertise:music",
      "name": "music",
      "subfields": [
        "Music Theory",
        "Music History",
        "Ethnomusicology",
        "Composition",
        "Performance Studies"
      ]
    },
    {
      "id": "field_of_expertise:cinematography",
      "name": "cinematography",
      "subfields": [
        "Lighting Techniques",
        "Camera Operation",
        "Lens Theory",
        "Color Grading",
        "Framing and Composition"
      ]
    },
    {
      "id": "field_of_expertise:literature",
      "name": "literature",
      "subfields": [
        "Literary Theory",
        "Comparative Literature",
        "Poetry Analysis",
        "Narrative Theory",
        "Postcolonial Literature"
      ]
    }
  ];

  export const embeddings = [
    {
      "id": "generated_content:essay_abc123",
      "type": "Essay",
      "title_or_topic": "Archetypes in Modern Cinema: A Jungian Perspective",
      "content": "Carl Jung's concept of archetypes offers a powerful lens through which to analyze recurring patterns in storytelling. This essay explores how fundamental archetypes like the Hero, the Shadow, and the Anima/Animus manifest in contemporary films, often reflecting collective unconscious themes prevalent in society...",
      "primary_field_name": "psychology",
      "primary_expert_name": "Carl Jung",
      "secondary_field_name": null,
      "secondary_expert_name": null,
      "created_at": "2023-10-27T10:30:00Z",
      "vector_embedding": [
        0.012, -0.034, 0.056, -0.001, 0.089, -0.023, 0.077, 0.015
        // ... typically much longer, e.g., 768 or 1024 floats
      ]
    },
    {
      "id": "generated_content:debate_xyz789",
      "type": "Debate",
      "title_or_topic": "Debate: Is Gender Performance (Butler) More Foundational Than Existential Choice (De Beauvoir)?",
      "content": "Introduction: The nature of identity, particularly gender identity, has been fiercely debated. Simone de Beauvoir famously argued 'One is not born, but rather becomes, a woman,' emphasizing existential choice and societal situation. Judith Butler later proposed gender as a performative act, constituted through repeated stylizations of the body...\n\nArgument 1 (Butler Perspective): Gender is not a stable identity but a doing, an improvisation within a scene of constraint...\n\nArgument 2 (De Beauvoir Perspective): While performance is relevant, the underlying condition of being-in-the-world and the conscious choices made in response to societal 'othering' remain primary...\n\nRebuttals and Conclusion...",
      "primary_field_name": "philosophy", // From Butler's perspective
      "primary_expert_name": "Judith Butler",
      "secondary_field_name": "philosophy", // From De Beauvoir's perspective
      "secondary_expert_name": "Simone de Beauvoir",
      "created_at": "2023-10-28T11:00:00Z"
      // "vector_embedding": [ ... ] // Embedding might be added later
    },
      {
      "id": "generated_content:essay_def456",
      "type": "Essay",
      "title_or_topic": "The Influence of Liturgical Music on Early Music Composition",
      "content": "Exploring the deep connections between theological practices and the development of musical forms in the medieval and renaissance periods. Focus on plainchant and polyphony...",
      "primary_field_name": "music", // Assuming an expert in Music History
      "primary_expert_name": "Hypothetical Musicologist", // We didn't define a music expert, using a placeholder
      "secondary_field_name": null,
      "secondary_expert_name": null,
      "created_at": "2023-10-29T09:15:00Z"
      // No embedding yet
    }
  ]