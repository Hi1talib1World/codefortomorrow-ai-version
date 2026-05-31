# 💸 MoneyPrinterTurbo: Beginner's Setup Guide

Welcome! I'm your coding mentor, and today we’re going to set up **MoneyPrinterTurbo**. This amazing tool uses AI to automatically write scripts, find video clips, add music, and generate subtitles to create high-quality short videos in one click.

---

## 📋 Prerequisites

Before we dive in, you will need a few "ingredients":

1.  **An LLM API Key:** This is the "brain" of the AI.
    *   *Recommendation:* Use [DeepSeek](https://www.deepseek.com/) or [Moonshot](https://www.moonshot.cn/). They are affordable and often offer free credits for new users.
2.  **A Pexels API Key:** This allows the tool to grab high-quality, copyright-free video clips. 
    *   Get one for free at [Pexels API](https://www.pexels.com/api/).
3.  **Python 3.11:** The programming language the project runs on.
4.  **ImageMagick:** A tool used to process images and text for your video.

---

## 🚀 Option 1: The "Easy Way" (Windows Only)

If you are on Windows and want to skip the technical setup:

1.  **Download:** Grab the "One-click start package" from [Baidu Netdisk](https://pan.baidu.com/s/1wg0UaIyXpO3SqIpaq790SQ?pwd=sbqx) (Code: `sbqx`) or [Google Drive](https://drive.google.com/file/d/1HsbzfT7XunkrCrHw5ncUjFX8XX4zAuUh/view?usp=sharing).
2.  **Extract:** Unzip the folder to a location on your PC (avoid paths with spaces or Chinese characters).
3.  **Update:** Double-click `update.bat` to get the latest features.
4.  **Run:** Double-click `start.bat`. Your browser will open automatically!

---

## 🛠️ Option 2: Manual Installation (Mac, Linux, & Advanced Windows)

Use this method if you want to learn how to manage code like a pro.

### Step 1: Clone the Project
Open your terminal (or CMD) and download the code:
```bash
git clone https://github.com/harry0703/MoneyPrinterTurbo.git
cd MoneyPrinterTurbo
```
*`git clone` copies the project from GitHub to your computer.*

### Step 2: Set Up a Virtual Environment
We want to keep this project's files organized and separate from your other apps.
```bash
python -m venv .venv
source .venv/bin/activate  # On Windows use: .venv\Scripts\activate
pip install -r requirements.txt
```
*`pip install` downloads all the "helper libraries" the project needs to run.*

### Step 3: Install ImageMagick
This is required for the subtitles to work.
*   **Windows:** Download the [Static Version](https://imagemagick.org/script/download.php) (look for `static.exe`). During installation, do not change the default path.
*   **Mac:** Run `brew install imagemagick` in your terminal.

---

## ⚙️ Configuration

1.  Inside the project folder, find a file named `config.example.toml`.
2.  **Rename it** to `config.toml`.
3.  Open it with any text editor (like Notepad or VS Code) and add your keys:
    ```toml
    [app]
    # Set your API keys here
    pexels_api_keys = ["YOUR_PEXELS_KEY_HERE"]
    llm_provider = "deepseek" # or "openai", "moonshot", etc.
    
    [llm]
    api_key = "YOUR_LLM_API_KEY_HERE"
    ```

---

## 🎬 How to Run

Once everything is configured, it's time to make some videos!

### Start the Web Interface
In your terminal, run:
```bash
python -m streamlit run ./webui/Main.py
```
*`streamlit` launches a beautiful, user-friendly website on your local computer.*

**Accessing the tool:**
*   Open your browser and go to: `http://localhost:8501`
*   Type in a **Video Theme** (e.g., "The importance of daily exercise").
*   Click **Generate** and watch the magic happen!

---

## 🔍 Basic Troubleshooting

*   **"No ffmpeg found":** FFmpeg is needed for video encoding. If you get this error, download it from [ffmpeg.org](https://ffmpeg.org/), extract it, and put the path to `ffmpeg.exe` in your `config.toml`.
*   **ImageMagick Errors:** If subtitles aren't showing up, double-check that the `imagemagick_path` in your `config.toml` matches exactly where you installed it.
*   **Blank Browser Page:** If the web page is white, try opening it in **Google Chrome** or **Microsoft Edge**.
*   **API Errors:** Ensure your VPN is set to "Global Mode" if you are in a region where OpenAI or Pexels is restricted.

**Happy Video Making!** If you get stuck, remember that every great developer started by fixing one error at a time. 🚀