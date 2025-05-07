# 🧠 Text Summarizer Chrome Extension

This Chrome extension allows you to **summarize any paragraph** of text you select on a webpage using **Google Gemini AI**. Just highlight the text, right-click, and choose **"Summarize This"** to instantly get a summary.

---

## 🚀 Features

- ✅ Right-click context menu for selected text
- ✅ Sends content to Google Gemini for summarization
- ✅ Displays summary in a simple alert popup (easily customizable)
- ✅ Fast and lightweight

---

## 📦 Installation Instructions

### 1. Clone or Download the Repository Or download the ZIP from GitHub and extract it.
### 2. Load the Extension in Chrome
Open Google Chrome.

Navigate to: chrome://extensions/

Enable Developer mode (toggle in the top right corner).

Click Load unpacked.

Select the folder you just cloned or extracted.

### 3. Add Your API Key
To use the AI summarization, you need a Google Gemini API key:

Visit: Google AI Studio

Copy your API key.

Open background.js in a text editor.

Replace this line:
const API_KEY = 'YOUR_API_KEY';

Save the file.

Reload the extension in chrome://extensions/

### 🧪 How to Use
Visit any webpage.

Select a paragraph or sentence.

Right-click and choose "Summarize This".

A popup alert will show you the AI-generated summary.

### 📂 Folder Structure
summarizer-extension

  ─ manifest.json     // Chrome extension manifest,
  
  ─ background.js     // Context menu + API call logic,
  
  ─ popup.html        // Optional popup interface,
  
  ─ README.md         // This documentation,

### Made with ❤️
