chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status !== 'complete') {
        return;
    }

    const tabUrl = tab.url || '';
    if (!tabUrl.includes('printful.me')) {
        return;
    }

    chrome.tabs.sendMessage(tabId, { type: 'PRINTFUL_PAGE_READY' }, () => {
        if (chrome.runtime.lastError) {
            console.debug('Printful content script not ready yet:', chrome.runtime.lastError.message);
        }
    });
});