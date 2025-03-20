document.addEventListener("DOMContentLoaded", function () {
    const noteContent = document.getElementById("noteContent");
    const saveNotes = document.getElementById("saveNotes");
    const clearNotes = document.getElementById("clearNotes");

    // Load stored notes
    chrome.storage.local.get("notes", function (data) {
        if (data.notes) {
            noteContent.value = data.notes;
        }
    });

    // Save notes with user-defined filename
    saveNotes.addEventListener("click", function () {
        const fileName = prompt("Enter file name:", "Smart_Notes");
        if (fileName) {
            const textBlob = new Blob([noteContent.value], { type: "text/plain" });
            const url = URL.createObjectURL(textBlob);
            chrome.downloads.download({ 
                url: url, 
                filename: fileName + ".txt"  // Append .txt to user-input filename
            });
        }
    });

    // Clear notes
    clearNotes.addEventListener("click", function () {
        chrome.storage.local.set({ notes: "" }, function () {
            noteContent.value = "";
        });
    });
});
