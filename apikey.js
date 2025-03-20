document.addEventListener("DOMContentLoaded", function () {
    const apiKeyInput = document.getElementById("apiKeyInput");
    const saveApiKey = document.getElementById("saveApiKey");

    chrome.storage.local.get("apiKey", function (data) {
        if (data.apiKey) {
            apiKeyInput.value = data.apiKey;
        }
    });

    saveApiKey.addEventListener("click", function () {
        chrome.storage.local.set({ apiKey: apiKeyInput.value }, function () {
            alert("API Key saved!");
            window.close();
        });
    });
});
