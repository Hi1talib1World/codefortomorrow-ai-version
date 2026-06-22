# 🌴 Setting Up Palmier Pro: Your AI Video Editor

Welcome! Palmier Pro is a professional-grade video editor built specifically for macOS using Swift. It’s unique because it allows you to work alongside AI agents (like Claude or Cursor) to edit your videos.

Follow this guide to get up and running on your Mac.

---

## 🛠 Prerequisites

Before we begin, ensure your Mac meets these specific requirements:

*   **Apple Silicon Mac:** You need a Mac with an M1, M2, or M3 chip (Intel Macs are not supported).
*   **macOS 26 (Tahoe):** This app is built for the latest features of macOS.
*   **Internet Connection:** Required for downloading the app and using Generative AI features.

---

## 🚀 Quick Installation

The fastest way to get started is to install the pre-built version of the app.

1.  **Download the App:** Click the link below to download the latest installer:
    [Download Palmier Pro (.dmg)](https://github.com/palmier-io/palmier-pro/releases/latest/download/PalmierPro.dmg)
2.  **Mount the Disk Image:** Open the downloaded `.dmg` file.
3.  **Install:** Drag the **Palmier Pro** icon into your **Applications** folder.
4.  **Launch:** Open your Applications folder and double-click Palmier Pro to start it.

---

## 🤖 How to Connect Your AI Agents

Palmier Pro uses something called **MCP (Model Context Protocol)**. Think of this as a "bridge" that allows AI coding tools to see your video timeline and help you edit.

### Option A: Using Cursor (Recommended for beginners)
Cursor is a popular AI code editor. To let Cursor control Palmier Pro:

1.  Open Palmier Pro.
2.  In the top menu bar, go to **Help** -> **MCP Instructions** -> **Install in Cursor**.
3.  Alternatively, you can do it manually:
    *   Open Cursor.
    *   Go to your settings and find the MCP section.
    *   Add a new "Generic Tool" with the URL: `http://127.0.0.1:19789/mcp`

### Option B: Using Claude Code
If you use the command-line version of Claude, run this command in your terminal:

```bash
claude mcp add --transport http palmier-pro http://127.0.0.1:19789/mcp
```
* **What this does:** It tells Claude exactly where to find Palmier Pro on your computer so they can communicate.*

---

## 🎥 Using the Editor

*   **Traditional Editing:** You can use Palmier Pro just like Premiere Pro or CapCut. Drag clips onto the timeline and trim them.
*   **Generative AI:** To generate new videos or images within the app (using models like Seedance or Kling), you will need to **Log In** and have an active subscription.
*   **Free Features:** The core video editor, the MCP server connection, and the AI agent chat integration are completely free and open source.

---

## 🔍 Basic Troubleshooting

**"App cannot be opened because the developer cannot be verified"**
*   **Fix:** Right-click the app in your Applications folder and select **Open**. This tells macOS you trust the software.

**"The MCP server isn't connecting"**
*   **Fix:** Ensure Palmier Pro is actually open. The "bridge" only works while the application is running.

**"I don't see the Generative AI tools"**
*   **Fix:** Make sure you are logged in. These specific features require a connection to Palmier's cloud servers and a subscription.

**"My Mac says the OS is too old"**
*   **Fix:** Palmier Pro requires macOS 26 (Tahoe). Check your System Settings to see if an update is available for your Apple Silicon Mac.