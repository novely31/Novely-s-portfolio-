export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

  if (!OPENAI_API_KEY) {
    return res.status(500).json({ error: "Missing API Key on Server" });
  }

  const { message } = req.body;

  if (!message || message.trim() === "") {
    return res.status(400).json({ error: "Message is required" });
  }

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
          {
            role: "system",
            content:
              "You are Novely's helpful portfolio chatbot. Always answer clearly and politely."
          },
          { role: "user", content: message }
        ]
      })
    });

    // If OpenAI returned an error
    if (!apiRes.ok) {
      const errorText = await apiRes.text();
      console.error("OpenAI Error:", errorText);
      return res.status(500).json({ error: "OpenAI request failed", detail: errorText });
    }

    const data = await apiRes.json();
    return res.status(200).json(data);

  } catch (error) {
    console.error("SERVER ERROR:", error);
    return res.status(500).json({ error: "Server crashed", detail: error.message });
  }
}
