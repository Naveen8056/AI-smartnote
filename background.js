chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "addText",
        title: "📌 Add to Notes",
        contexts: ["selection"]
    });

    chrome.contextMenus.create({
        id: "explainText",
        title: "📝 Explain",
        contexts: ["selection"]
    });
});

chrome.contextMenus.onClicked.addListener((info) => {
    if (info.menuItemId === "addText") {
        chrome.storage.local.get({ notes: "" }, function (data) {
            let updatedNotes = data.notes ? data.notes + "\n• " + info.selectionText : "• " + info.selectionText;
            chrome.storage.local.set({ notes: updatedNotes });

            // Open Notepad in a popup
            chrome.windows.create({
                url: chrome.runtime.getURL("notepad.html"),
                type: "popup",
                width: 500,
                height: 400
            });
        });
    }

    if (info.menuItemId === "explainText") {
        chrome.storage.local.get("apiKey", function (data) {
            if (!data.apiKey) {
                chrome.windows.create({
                    url: chrome.runtime.getURL("apikey.html"),
                    type: "popup",
                    width: 400,
                    height: 250
                });
                return;
            }

            fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${data.apiKey}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: "Explain this briefly and simply: " + info.selectionText }] }]
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data && data.candidates && data.candidates.length > 0) {
                    let explanation = data.candidates[0].content.parts[0].text;
                    chrome.storage.local.set({ explanation });

                    chrome.windows.create({
                        url: chrome.runtime.getURL("explanation.html"),
                        type: "popup",
                        width: 500,
                        height: 400
                    });
                } else {
                    console.error("Failed to generate explanation.");
                }
            })
            .catch(() => console.error("Error in generating explanation!"));
        });
    }
});
