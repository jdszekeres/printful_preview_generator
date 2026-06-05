document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get(['previewHtml'], (result) => {

        if (result.previewHtml) {
            const htmlElement = document.getElementById('content');
            htmlElement.innerHTML = result.previewHtml;

            
        }
    });
});