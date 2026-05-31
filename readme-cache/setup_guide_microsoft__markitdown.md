# 🚀 Getting Started with MarkItDown

**MarkItDown** is a handy tool that takes various files—like PDFs, Word documents, and Excel sheets—and turns them into **Markdown**. Markdown is a simple text format that is easy for humans to read and perfect for AI tools (like ChatGPT) to process.

---

## 🛠 Prerequisites

Before we begin, you need to have **Python** installed on your computer.

1.  **Check Python Version:** MarkItDown requires **Python 3.10 or higher**.
    *   Open your terminal (Command Prompt on Windows, Terminal on Mac/Linux).
    *   Type `python --version` and press Enter.
2.  **Create a Virtual Environment (Recommended):**
    Think of this as a "private workspace" for your project so its files don't get mixed up with other things on your computer.
    *   **Windows:**
        ```bash
        python -m venv .venv
        .venv\Scripts\activate
        ```
    *   **Mac/Linux:**
        ```bash
        python3 -m venv .venv
        source .venv/bin/activate
        ```

---

## 📥 Quick Installation

The easiest way to install MarkItDown is using `pip`, which is the standard tool for downloading Python packages.

Run this command in your terminal:

```bash
pip install 'markitdown[all]'
```

**What does this command do?**
*   `pip install`: Downloads and installs the software.
*   `'markitdown[all]'`: The `[all]` part tells Python to install every possible "extra" feature, including the ability to read PDFs, Word docs, and Excel files.

---

## 🚀 How to Run

You can use MarkItDown in two ways: directly in your terminal or inside a Python script.

### Option 1: Use it in the Terminal (Easiest)
If you have a file named `presentation.pptx` and you want to turn it into a Markdown file named `result.md`, run:

```bash
markitdown presentation.pptx -o result.md
```
*   `-o` stands for **output**. It tells the program where to save the converted text.

### Option 2: Use it in a Python Script
If you are writing your own program, you can use MarkItDown like this:

1. Create a new file called `convert.py`.
2. Paste this code inside:

```python
from markitdown import MarkItDown

# 1. Initialize the tool
md = MarkItDown()

# 2. Convert a file
result = md.convert("your-file.pdf")

# 3. Print the text to your screen
print(result.text_content)
```

3. Run it by typing `python convert.py` in your terminal.

---

## 📂 Supported File Types
MarkItDown is like a Swiss Army knife! It can handle:
*   📄 **Documents:** PDF, Word (.docx), PowerPoint (.pptx), Excel (.xlsx)
*   🖼️ **Images:** Extracts metadata (details about the photo)
*   🎵 **Audio:** Transcribes speech to text
*   🌐 **Web:** HTML pages and YouTube URLs
*   📦 **Archives:** Zip files

---

## 🔍 Basic Troubleshooting

**"Command not found: markitdown"**
*   Make sure you activated your virtual environment (the `.venv` step above).
*   Try running `python -m markitdown` instead of just `markitdown`.

**"Error: Python 3.10+ required"**
*   Your version of Python is too old. Visit [python.org](https://www.python.org/) to download the latest version.

**"The conversion is missing some data"**
*   MarkItDown is designed for "text analysis" (making it readable for computers). It might not look exactly like the original document, but the headings, tables, and lists should be there!

**Need more help?**
If you want to use advanced features like **OCR** (reading text inside images) or **Azure Integration**, you can find those details in the full documentation, but the steps above are all you need to get started! 🌟