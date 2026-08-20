import "dotenv/config";

export const env = {
  port: Number(process.env.PORT) || 5000,

  clientOrigin:
    process.env.CLIENT_ORIGIN ||
    "https://voice-health-screener-three.vercel.app",

  groqApiKey: process.env.GROQ_API_KEY || "",

  groqModel: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
};
