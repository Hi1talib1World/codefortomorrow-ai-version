# 🚀 Setting Up Headroom: Save 90% on AI Tokens

Welcome! **Headroom** is a tool that acts like a "compression filter" for your AI. It shrinks the data (logs, code, and files) that you send to AI models like Claude or GPT-4. This saves you a massive amount of money on "tokens" and lets you fit more information into the AI's memory.

---

## 📋 Prerequisites

Before we start, make sure you have these installed on your computer:

1.  **Python (3.10 or higher):** Headroom needs a modern version of Python. 
    *   *Check by typing:* `python --version`
2.  **Node.js (Optional):** Only needed if you plan to use it with JavaScript or TypeScript projects.
3.  **An AI Agent (Optional):** If you use tools like **Claude Code**, **Aider**, or **Cursor**, Headroom can plug directly into them.

---

## 📥 Quick Installation

You can install Headroom using your terminal (Command Prompt, Terminal, or PowerShell).

### For Python users (Recommended)
Run this command to install the full version with all features:
```bash
pip install "headroom-ai[all]"
```
*   **What this does:** This downloads the `headroom-ai` package and all its "extras" (like the machine learning models and proxy tools) so everything works out of the box.

### For Node.js / TypeScript users
If you are building a web app, run:
```bash
npm install headroom-ai
```
*   **What this does:** Adds the Headroom library to your JavaScript project's `node_modules` folder.

---

## 🛠️ How to Run Headroom

There are three ways to use Headroom depending on your needs.

### 1. The "Easy Button" (Wrap your Agent) 🤖
If you use a coding assistant, you can "wrap" it to start saving tokens immediately.
```bash
headroom wrap claude
```
*   **What this does:** It starts the Claude coding agent but routes everything through Headroom first to compress the data.

### 2. The "Set it and Forget it" Proxy 🌐
If you have an app that talks to OpenAI or Anthropic, you can use the Proxy mode.
```bash
headroom proxy --port 8787
```
*   **What this does:** It creates a "middleman" server on your computer. You just change the "Base URL" in your app to `http://localhost:8787`, and Headroom will automatically shrink every request you send.

### 3. For Developers (In your Code) 🐍
You can use it directly inside a Python script:
```python
from headroom import compress

# Your long text or logs
messages = [{"role": "user", "content": "...very long log data..."}]

# Compress it!
compressed_messages = compress(messages)
print(f"Tokens saved!")
```

---

## 📈 Check Your Savings
Once you've run Headroom for a bit, you can see how much data (and money) you’ve saved by running:
```bash
headroom perf
```
This will show you a "Before vs. After" chart of your token usage.

---

## 🔍 Basic Troubleshooting

**"Command not found: headroom"**
*   **Fix:** Your Python "Scripts" folder might not be in your System PATH. Try running `python -m headroom` instead of just `headroom`.

**"Requires Python 3.10+"**
*   **Fix:** Headroom uses modern Python features. If your version is older (like 3.8), you'll need to update Python from [python.org](https://python.org).

**The AI gives weird answers**
*   **Fix:** Headroom uses "reversible" compression. If the AI is confused, it is designed to automatically "fetch" the original uncompressed data. Ensure you have an active internet connection so the agent can communicate with the Headroom local store.

**Port 8787 is already in use**
*   **Fix:** If the proxy fails to start, try a different port: `headroom proxy --port 9000`.