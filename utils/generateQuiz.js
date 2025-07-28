// import axios from "axios"
import dotenv from "dotenv";
// import { InferenceClient } from "@huggingface/inference";

dotenv.config();
const HF_TOKEN = process.env.HUGGINGFACE_TOKEN;
const MODEL = "Llama-3.1-8B-Instruct";


// const client = new InferenceClient(HF_TOKEN)
import { OpenAI } from "openai";

const client = new OpenAI({
    baseURL: "https://router.huggingface.co/v1",
    apiKey: HF_TOKEN,
});


async function generateMCQsFromTopic(topic) {
    const prompt = `
        You are a JSON generation API. Your sole function is to create a JSON array of multiple-choice questions (MCQs).

        **Topic:** "${topic}"

        **Strict Instructions:**
        1.  **Topic Relevance:** Every question must be directly relevant to the provided topic.
        2.  **Total Questions:** Generate exactly 10 MCQs.
        3.  **Difficulty Mix:** The distribution must be: 4 basic, 3 intermediate, and 3 advanced.
        4.  **Option Conciseness:** Each answer option (A, B, C, D) must be very concise.
        5.  **Output Format:** Your entire response MUST be a single, valid JSON array. Do not include any markdown (like \`\`\`json), introductory text, or explanations.

        Example of the expected outcome
        **JSON Schema for each object:**
        {
        "level": "string", // "basic", "intermediate", or "advanced"
        "question": "string",
        "options": {
            "A": "string", // Max 4 words
            "B": "string", // Max 4 words
            "C": "string", // Max 4 words
            "D": "string"  // Max 4 words
        },
        "answer": "string" // Must be "A", "B", "C", or "D"
        }
        Always return a valid schema
        `;

    try {
        const response = await client.chat.completions.create({
            model: "meta-llama/Llama-3.1-8B-Instruct", // provider-supported model
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant that generates well‑structured MCQs based on a topic."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.4
        });

        const content = response.choices?.[0]?.message?.content;
        const mcqs = JSON.parse(content);
        console.log(mcqs);
        return mcqs;

    } catch (err) {
        console.error("❌ Error:", err?.response?.data || err.message);
    }
}

// Example usage
generateMCQsFromTopic("Java");