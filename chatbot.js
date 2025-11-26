/* ============================================================
   CHATBOT — VERCEL BACKEND + REALTIME DATE/TIME + COPY BUTTON
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
   ADD MESSAGE (Supports Copy Button)
   ============================================================ */
function appendMessage(text, sender = "bot") {
  const msg = document.createElement("div");
  msg.className = `message ${sender}`;

  if (sender === "bot") {
    msg.innerHTML = `
      <div class="msg-text">${text}</div>
      <button class="copy-btn">Copy</button>
    `;
  } else {
    msg.textContent = text;
  }

  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;

  if (sender === "bot") {
    const btn = msg.querySelector(".copy-btn");
    btn.addEventListener("click", () => {
      navigator.clipboard.writeText(text);
      btn.textContent = "Copied!";
      setTimeout(() => (btn.textContent = "Copy"), 1500);
    });
  }
}

/* ============================================================
   CALL VERCEL BACKEND WITH REALTIME DATE/TIME
   ============================================================ */
async function callOpenAI(prompt) {
  const nowPH = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Manila",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true
  });

  try {
    const res = await fetch("https://noveportfolio.vercel.app/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: prompt,
        date: nowPH  // ← SEND REALTIME DATE TO BACKEND
      })
    });

    const data = await res.json();
    return data?.choices?.[0]?.message?.content || "No response.";
  } catch (err) {
    return "Server error. Please try again.";
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

  const loader = document.createElement("div");
  loader.className = "message bot";
  loader.textContent = "Thinking...";
  chatBox.appendChild(loader);

  const reply = await callOpenAI(text);

  loader.innerHTML = `
    <div class="msg-text">${reply}</div>
    <button class="copy-btn">Copy</button>
  `;

  const btn = loader.querySelector(".copy-btn");
  btn.addEventListener("click", () => {
    navigator.clipboard.writeText(reply);
    btn.textContent = "Copied!";
    setTimeout(() => (btn.textContent = "Copy"), 1500);
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
