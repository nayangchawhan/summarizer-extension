chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "summarizeText",
    title: "Summarize This",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "summarizeText") {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: summarizeSelectedText,
      args: [info.selectionText]
    });
  }
});

async function summarizeSelectedText(selectedText) {
  const API_KEY = 'YOUR API KEY'; // Replace with your Gemini or OpenAI API key
  const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=' + API_KEY, {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: `Summarize this: ${selectedText}` }] }]
    })
  });

  const result = await response.json();
  const summary = result.candidates?.[0]?.content?.parts?.[0]?.text || "Failed to summarize.";
  alert(summary);
}
