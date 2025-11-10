document.addEventListener("DOMContentLoaded", () => {
  const askBtn = document.getElementById("askBtn");
  const questionEl = document.getElementById("question");
  const responseDiv = document.getElementById("response");
  const speakBtn = document.getElementById("speakBtn");

  askBtn.addEventListener("click", async () => {
    const question = questionEl.value.trim();
    if (!question) {
      responseDiv.textContent = "⚠️ Please enter a 'what if' question.";
      return;
    }

    responseDiv.textContent = "⏳ Thinking...";
    askBtn.disabled = true;
    speakBtn.disabled = true;

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      const data = await res.json();
      if (data.answer) {
        responseDiv.textContent = data.answer;
        speakBtn.disabled = false;

        // Auto-speak after response
        speakText(data.answer, responseDiv);
      } else {
        responseDiv.textContent = "❌ No response from AI.";
      }
    } catch (err) {
      responseDiv.textContent = "❌ " + err.message;
    } finally {
      askBtn.disabled = false;
    }
  });

  // Manual speech playback button
  speakBtn.addEventListener("click", () => {
    const text = responseDiv.textContent.trim();
    if (text) speakText(text, responseDiv);
  });
});

// 🎤 Text-to-speech function
function speakText(text, responseDiv) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.pitch = 1;
  utterance.rate = 1;

  responseDiv.classList.add("speaking");
  utterance.onend = () => responseDiv.classList.remove("speaking");

  speechSynthesis.cancel(); // stop any previous speech
  speechSynthesis.speak(utterance);
}
