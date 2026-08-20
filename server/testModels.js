import Groq from "groq-sdk";
import "dotenv/config";

console.log("Starting Groq model test...");

console.log("API key loaded:", process.env.GROQ_API_KEY ? "YES" : "NO");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

try {
  console.log("Requesting models from Groq...");

  const response = await groq.models.list();

  console.log("SUCCESS!");
  console.log("Number of models:", response.data.length);

  for (const model of response.data) {
    console.log("-", model.id);
  }
} catch (error) {
  console.log("FAILED!");
  console.log("Status:", error.status);
  console.log("Message:", error.message);
}
