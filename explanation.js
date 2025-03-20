document.addEventListener("DOMContentLoaded", function () {
    const explanationText = document.getElementById("explanationText");
    const closePopup = document.getElementById("closePopup");

    chrome.storage.local.get("explanation", function (data) {
        explanationText.innerText = data.explanation || "No explanation available.";
    });

    closePopup.addEventListener("click", function () {
        chrome.storage.local.remove("explanation", function () {
            window.close();
        });
    });
});