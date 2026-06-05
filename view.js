document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get(['previewHtml'], (result) => {

        if (result.previewHtml) {
            const htmlElement = document.getElementById('content');
            htmlElement.innerHTML = result.previewHtml;

            //find the script tag and execute it
            const scriptTag = htmlElement.querySelector('script');
            if (scriptTag) {
                Function(scriptTag.textContent)();
            }
            
        }
    });
});