import fetch from "node-fetch";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

const SYSTEM_PROMPT = `
You are SalFa, an academic assistant for secondary school students.
Answer only academic questions simply and clearly.
Politely decline non-academic questions.
`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { question } = req.body;
  if (!question || question.trim().length < 3) {
    return res.status(400).json({ error: "Question is required" });
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openrouter/auto",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: question.trim() }
        ],
        temperature: 0.3
      }),
    });

    const data = await response.json();
    const answer = data?.choices?.[0]?.message?.content || "Sorry, no answer found.";
    res.status(200).json({ answer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
}
