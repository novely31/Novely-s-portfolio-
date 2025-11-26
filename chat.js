export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

  if (!OPENAI_API_KEY) {
    return res.status(500).json({ error: "Missing API Key" });
  }

  const { message } = req.body;

  try {
    const apiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are Novely's portfolio chatbot." },
          { role: "user", content: message }
        ]
      })
    });

    const data = await apiRes.json();
    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ error: "Server error" });
  }
}
