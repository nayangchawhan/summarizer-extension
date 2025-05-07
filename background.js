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
      func: injectedSummarizeScript,
      args: [info.selectionText]
    });
  }
});

function injectedSummarizeScript(selectedText) {
  (async () => {
    const API_KEY = 'AIzaSyAF-6qGghCA1Iu6_ZLNRbS5WXWj0OSy7ZA';

    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=' + API_KEY,
      {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Summarize this: ${selectedText}` }] }]
        })
      }
    );

    const result = await response.json();
    const summary = result.candidates?.[0]?.content?.parts?.[0]?.text || "Failed to summarize.";

    // Store history in window
    window.summaryHistory = window.summaryHistory || [];
    window.summaryHistory.unshift(summary);

    // Remove old panel and wrapper
    document.getElementById("summary-panel")?.remove();
    const wrapper = document.getElementById("page-wrapper");
    let bodyChildren;

    if (!wrapper) {
      // First time summarizing: wrap existing body content
      bodyChildren = Array.from(document.body.children);
      const newWrapper = document.createElement("div");
      newWrapper.id = "page-wrapper";
      newWrapper.style.transition = "margin-right 0.3s ease";
      newWrapper.style.marginRight = "35%";

      bodyChildren.forEach(child => {
        if (child.id !== "summary-panel") newWrapper.appendChild(child);
      });

      // Clear body without nuking everything
      while (document.body.firstChild) {
        document.body.removeChild(document.body.firstChild);
      }
      document.body.appendChild(newWrapper);
    } else {
      // Already wrapped
      wrapper.style.marginRight = "35%";
    }

    // Create summary panel
    const panel = document.createElement("div");
    panel.id = "summary-panel";

    const summaryHTML = window.summaryHistory.map((sum, index) => {
      const id = `copy-btn-${index}`;
      return `
        <div style="margin-bottom: 20px; padding-bottom: 10px; border-bottom: 1px solid #333;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-weight: bold; color: #ccc;">Summary ${window.summaryHistory.length - index}</span>
            <button id="${id}" style="background: #333; color: #fff; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">Copy</button>
          </div>
          <p style="white-space: pre-wrap; margin-top: 5px; color: #e5e5e5;">${sum}</p>
        </div>
      `;
    }).join("");

    panel.innerHTML = `
      <div style="display: flex; flex-direction: column; height: 100%;">
        <div style="padding: 20px; border-bottom: 1px solid #333;">
          <h2 style="margin: 0; font-size: 20px; color: #fff;">AI Summaries</h2>
        </div>
        <div id="summary-list" style="padding: 20px; overflow-y: auto; flex-grow: 1;">
          ${summaryHTML}
        </div>
        <div style="padding: 10px; border-top: 1px solid #333; text-align: right;">
          <button id="close-summary-panel" style="padding: 8px 12px; background: #444; color: #fff; border: none; border-radius: 4px; cursor: pointer;">Close</button>
        </div>
      </div>
    `;

    Object.assign(panel.style, {
      position: "fixed",
      top: "0",
      right: "0",
      width: "35%",
      height: "100%",
      backgroundColor: "#1e1e1e",
      zIndex: 999999,
      boxShadow: "-4px 0 12px rgba(0,0,0,0.3)",
      fontFamily: "Segoe UI, sans-serif",
      display: "flex",
      flexDirection: "column"
    });

    document.body.appendChild(panel);

    // Attach copy handlers
    window.summaryHistory.forEach((sum, index) => {
      const btn = document.getElementById(`copy-btn-${index}`);
      if (btn) {
        btn.addEventListener("click", () => {
          navigator.clipboard.writeText(sum).then(() => {
            btn.textContent = "Copied!";
            setTimeout(() => btn.textContent = "Copy", 1500);
          });
        });
      }
    });

    // Close button
    document.getElementById("close-summary-panel").addEventListener("click", () => {
      panel.remove();
      const wrapper = document.getElementById("page-wrapper");
      if (wrapper) wrapper.style.marginRight = "0";
    });
  })();
}
