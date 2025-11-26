/* ============================================================
   PORTFOLIO CHATBOT — VERCEL BACKEND + REALTIME DATE + COPY BTN
   ============================================================ */

const chatContainer = document.getElementById("chatbotContainer");
const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const openChatBtn = document.getElementById("openChatBtn");
const closeChatBtn = document.getElementById("closeChatBtn");

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
   APPEND MESSAGE + COPY BUTTON
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

  // Copy button behavior
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
   CALL VERCEL BACKEND /api/chat
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

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: prompt, date: currentDate })
    });

    const data = await response.json();

    if (!data.choices) return "Server error ❌";

    return data.choices[0].message.content;

  } catch (err) {
    return "Connection error ❌";
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

  // Loader
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
