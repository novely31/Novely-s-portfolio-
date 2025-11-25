/* ============================================================
   PORTFOLIO CHATBOT — OPENAI API WITH MANUAL KEY + COPY BUTTON
   ============================================================ */

const chatContainer = document.getElementById("chatbotContainer");
const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const openChatBtn = document.getElementById("openChatBtn");
const closeChatBtn = document.getElementById("closeChatBtn");

/* ============================================================
   YOUR API KEY (Use your real key)
   ============================================================ */
const OPENAI_API_KEY = "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;

/* ============================================================
   SHOW / HIDE CHATBOT
   ============================================================ */
function toggleChatbot() {
  const hidden = chatContainer.style.display === "none" || chatContainer.style.display === "";
  chatContainer.style.display = hidden ? "block" : "none";
}

openChatBtn.addEventListener("click", toggleChatbot);
closeChatBtn.addEventListener("click", toggleChatbot);

/* ============================================================
   ADD MESSAGE (With Copy Button for bot)
   ============================================================ */
function appendMessage(text, sender = "bot") {
  const div = document.createElement("div");
  div.className = `message ${sender}`;

  if (sender === "bot") {
    div.innerHTML = `
      <div class="msg-text">${text}</div>
      <button class="copy-btn">Copy</button>
    `;
  } else {
    div.textContent = text;
  }

  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;

  if (sender === "bot") {
    const btn = div.querySelector(".copy-btn");
    btn.addEventListener("click", () => {
      navigator.clipboard.writeText(text);
      btn.textContent = "Copied!";
      setTimeout(() => (btn.textContent = "Copy"), 1500);
    });
  }
}

/* ============================================================
   OPENAI CALL (with real date/time injection)
   ============================================================ */
async function callOpenAI(prompt) {
  try {

    const currentDate = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Manila",
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true
    });

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
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
            content: `You are Novely's helpful portfolio assistant.
            The current accurate date and time in the Philippines is: ${currentDate}.
            ALWAYS use this exact date and time when answering questions about today.`
          },
          { role: "user", content: prompt }
        ]
      })
    });

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "Error: No response.";
  } catch (err) {
    console.error(err);
    return "Network error.AI API currently disabled,under contruct today ";
  }
}

/* ============================================================
   SEND MESSAGE
   ============================================================ */
async function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  appendMessage(text, "user");
  userInput.value = "";

  const loading = document.createElement("div");
  loading.className = "message bot";
  loading.textContent = "Thinking...";
  chatBox.appendChild(loading);

  const reply = await callOpenAI(text);

  loading.innerHTML = `
    <div class="msg-text">${reply}</div>
    <button class="copy-btn">Copy</button>
  `;

  const copyBtn = loading.querySelector(".copy-btn");
  copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(reply);
    copyBtn.textContent = "Copied!";
    setTimeout(() => (copyBtn.textContent = "Copy"), 1500);
  });

  chatBox.scrollTop = chatBox.scrollHeight;
}

sendBtn.addEventListener("click", sendMessage);

userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});
