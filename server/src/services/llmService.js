import Groq from "groq-sdk";
import { env } from "../config/env.js";

const groq = new Groq({
  apiKey: env.groqApiKey,
});

const FIELDS = [
  "patientName",
  "chiefComplaint",
  "onsetDuration",
  "severity",
  "associatedSymptoms",
];

function buildIntakeSystemPrompt(collected, language) {
  const missing = FIELDS.filter((field) => !collected[field]);

  const languageInstruction =
    language === "hi"
      ? "Respond in Hindi using Devanagari script. Match the language the patient is speaking."
      : "Respond in English. If the patient switches to Hindi, switch to Hindi.";

  return `
You are an empathetic medical intake voice assistant conducting a preliminary health screening call.

Your job is to gently collect the following information:

1. Patient's name
2. Primary symptom / chief complaint
3. Onset and duration
4. Severity
5. Associated or secondary symptoms

Fields already collected:
${FIELDS.filter((field) => collected[field]).join(", ") || "none yet"}

Fields still needed:
${missing.join(", ") || "none"}

RULES:
- Ask only ONE question at a time.
- Never ask two questions in one turn.
- Keep responses to 1-2 short sentences.
- This response will be spoken aloud.
- If an answer is vague, ask one short clarification.
- Never repeat information already provided.
- Be warm, supportive, and professional.
- Avoid unnecessary medical jargon.
- Do not diagnose.
- Do not provide medical advice.
- You are collecting information for a healthcare professional.
- ${languageInstruction}

If all required information has been collected, briefly thank the patient and tell them they can end the call.
`;
}

function inferCollectedFields(history) {
  const userTurns = history.filter((message) => message.role === "user").length;

  const collected = {};

  FIELDS.forEach((field, index) => {
    if (userTurns > index) {
      collected[field] = true;
    }
  });

  return collected;
}

export async function getAIResponse(history, language = "en") {
  if (!env.groqApiKey) {
    throw new Error("GROQ_API_KEY is not configured on the server.");
  }

  const collected = inferCollectedFields(history);

  const systemPrompt = buildIntakeSystemPrompt(collected, language);

  const messages = [
    {
      role: "system",
      content: systemPrompt,
    },
    ...history.map((message) => ({
      role: message.role,
      content: message.content,
    })),
  ];

  if (history.length === 0) {
    messages.push({
      role: "user",
      content:
        "[CALL_STARTED] Greet the patient warmly and ask for their name.",
    });
  }

  const completion = await groq.chat.completions.create({
    model: env.groqModel,
    messages,
    temperature: 0.6,
    max_tokens: 150,
  });

  return (
    completion.choices[0]?.message?.content?.trim() ||
    "I'm sorry, could you repeat that?"
  );
}

const REPORT_JSON_INSTRUCTIONS = `
You are a clinical scribe.

Read the transcript of a voice health-intake call and produce a structured JSON summary for a healthcare provider.

Respond with ONLY a JSON object.

Use exactly this structure:

{
  "patientName": string | null,
  "chiefComplaint": string | null,
  "onsetDuration": string | null,
  "severity": string | null,
  "associatedSymptoms": string[] | null,
  "redFlags": string[] | null,
  "recommendedFollowUp": string | null,
  "summary": string,
  "callCompleteness": "complete" | "partial" | "minimal"
}

RULES:

- Never invent information.
- Use null when information was not discussed.
- "minimal" means fewer than 2 exchanges happened.
- "partial" means some but not all important fields were covered.
- "complete" means name, complaint, duration, and severity were covered.
- Summary must be 2-4 concise sentences.
- Red flags should only include symptoms actually mentioned.
- Examples of red flags include chest pain, difficulty breathing, severe or worsening symptoms.
- Use an empty array if no red flags were mentioned.
- Keep everything grounded strictly in the transcript.
`;

export async function generateHealthReport(history) {
  if (!env.groqApiKey) {
    throw new Error("GROQ_API_KEY is not configured on the server.");
  }

  if (!history || history.length === 0) {
    return {
      patientName: null,
      chiefComplaint: null,
      onsetDuration: null,
      severity: null,
      associatedSymptoms: null,
      redFlags: null,
      recommendedFollowUp: null,
      summary:
        "The call ended before any information was exchanged. No data was collected.",
      callCompleteness: "minimal",
    };
  }

  const transcriptText = history
    .map(
      (message) =>
        `${
          message.role === "user" ? "Patient" : "Assistant"
        }: ${message.content}`,
    )
    .join("\n");

  const completion = await groq.chat.completions.create({
    model: env.groqModel,
    messages: [
      {
        role: "system",
        content: REPORT_JSON_INSTRUCTIONS,
      },
      {
        role: "user",
        content: `Transcript:\n\n${transcriptText}`,
      },
    ],
    temperature: 0.2,
    max_tokens: 500,
    response_format: {
      type: "json_object",
    },
  });

  const raw = completion.choices[0]?.message?.content?.trim() || "{}";

  try {
    return JSON.parse(raw);
  } catch (error) {
    console.error("Failed to parse report JSON:", error);

    return {
      patientName: null,
      chiefComplaint: null,
      onsetDuration: null,
      severity: null,
      associatedSymptoms: null,
      redFlags: null,
      recommendedFollowUp: null,
      summary: "The report could not be structured automatically.",
      callCompleteness: history.length < 4 ? "partial" : "complete",
      _rawFallback: raw,
    };
  }
}
