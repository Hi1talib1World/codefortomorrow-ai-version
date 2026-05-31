# 🚀 Getting Started with Claude Code

Welcome! I’m glad you’re here to level up your coding workflow. **Claude Code** is like having a pair-programmer living right inside your terminal. It can write code, fix bugs, and handle Git for you using simple English.

Follow this guide to get up and running in minutes.

---

## 📋 Prerequisites

Before we install Claude Code, we need to make sure your computer has the right "engine" to run it.

1.  **Node.js (Version 18 or higher):** This is the environment that allows your computer to run JavaScript tools.
    *   **How to check:** Open your terminal (Command Prompt, PowerShell, or Terminal) and type:
        ```bash
        node -v
        ```
    *   **What to look for:** If you see a number like `v18.x.x` or `v20.x.x`, you are good to go!
    *   **If you don't have it:** Download it from [nodejs.org](https://nodejs.org/).

---

## ⚡ Quick Installation

Choose the command below that matches your computer's operating system. Copy and paste it into your terminal.

### 🍎 For MacOS or 🐧 Linux
Use this command to download and install the tool automatically:
```bash
curl -fsSL https://claude.ai/install.sh | bash
```
* **What this does:** `curl` fetches the installation script from the internet, and `bash` executes it to set up Claude on your system.

### 🪟 For Windows
Open **PowerShell** and run:
```powershell
irm https://claude.ai/install.ps1 | iex
```
* **What this does:** `irm` (Invoke-RestMethod) gets the installer, and `iex` (Invoke-Expression) runs it immediately.

---

## 🛠️ How to Run Claude Code

Now that it's installed, let's put it to work!

1.  **Open your project folder:** In your terminal, use the `cd` (change directory) command to go to a folder where you have some code.
    ```bash
    cd path/to/your/awesome-project
    ```
2.  **Start the tool:** Simply type:
    ```bash
    claude
    ```
3.  **First-time Login:** If it’s your first time, the tool will guide you through a quick login process to connect it to your Anthropic (Claude) account.

Once it's running, you can just talk to it! Try asking:
*   *"Explain what the main function in this project does."*
*   *"Find the bug in index.js and fix it."*
*   *"Help me commit these changes to Git."*

---

## 🔍 Basic Troubleshooting

If things aren't working quite right, don't panic! Here are the most common fixes:

*   **"Command not found":** If you just installed it and typing `claude` doesn't work, try closing your terminal and opening it again. This "refreshes" the terminal's memory.
*   **Permission Denied:** If the installer fails on Mac/Linux, you might need to run the command with `sudo` at the beginning, though the recommended curl script usually handles this.
*   **Wrong Node Version:** If you see an error about "Unsupported engine," it means your Node.js is too old. Head back to [nodejs.org](https://nodejs.org/) and install the latest "LTS" version.
*   **Need Help?** You can always type `/bug` inside the tool to report an issue, or type `/help` to see a list of available commands.

**Happy coding! 💻✨**