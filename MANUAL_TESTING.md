# Memora AI - Manual Testing Guide

Use this checklist to manually verify that your Memora AI agent is working correctly.

## 1. ✅ Basic Chat Functionality
- [ ] Open the app at `http://localhost:5173`
- [ ] Type "Hello, who are you?" in the input box.
- [ ] Click the **Send** button (arrow icon) or press **Enter**.
- [ ] **Expected Result**: The AI should reply with a greeting and introduce itself as Memora.

## 2. 🧠 Memory System Test
- [ ] **Store a Memory**:
  - Type: "My favorite color is purple."
  - Send the message.
  - **Expected Result**: AI acknowledges it (e.g., "I'll remember that your favorite color is purple.").
- [ ] **Recall a Memory**:
  - Refresh the page (optional, to prove persistence).
  - Type: "What is my favorite color?"
  - **Expected Result**: AI replies "Your favorite color is purple."
  - **Check**: Look for the "Recalled 1 memories" indicator above the AI's response.

## 3. ✨ Enhance Prompt Feature
- [ ] Type a simple word like "weather" or "recipe" (do NOT send yet).
- [ ] Click the **Sparkles Icon** (middle button).
- [ ] Wait 1-2 seconds.
- [ ] **Expected Result**: The text "weather" changes to a complete question like "Could you please provide me with the current weather conditions?".
- [ ] Click **Send** to get the answer.

## 4. 🎤 Voice Input Test
- [ ] Click the **Microphone Icon**.
- [ ] Speak a short sentence (e.g., "Tell me a joke").
- [ ] **Expected Result**: Your spoken words appear in the input box automatically.
- [ ] Click **Send**.

## 5. ⚙️ Settings & UI
- [ ] **Dark/Light Mode**:
  - Click the **Settings** (gear icon) in the sidebar.
  - Toggle "Dark Mode" off.
  - **Expected Result**: App switches to light theme; text should remain readable.
- [ ] **Memory Toggle**:
  - In the input bar, click the **Brain Icon** (left side).
  - **Expected Result**: Icon dims/turns off.
  - Type "My name is John."
  - **Expected Result**: AI replies, but this info will NOT be stored in long-term memory.

## 6. 🔌 Connection Status
- [ ] Look at the **Memory Core** panel in the sidebar.
- [ ] **Expected Result**: It should show a green dot and **ONLINE**.

---

### 🛑 Troubleshooting
- **If "Offline"**: Ensure backend is running (`python main.py`).
- **If "Enhance" fails**: Ensure you are connected to the internet (it calls Gemini API).
- **If Voice fails**: Ensure microphone permission is allowed in the browser.
