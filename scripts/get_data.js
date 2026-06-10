
function getProduct() {
    return new Promise((resolve) => {
        setTimeout(() => {
            const products = [];

            document.querySelectorAll('a[href*="/product/"]').forEach((link) => {
                const card = link.closest('article, div');
                const img = card?.querySelector('img');
                products.push({
                    title: link.innerText.split('\n')[0].trim(),
                    url: link.href,
                    image: img?.src || ''
                });
            });

            resolve(products);
        }, 4000);
    });
}

async function onPrintfulPage() {
    const products = await getProduct();
    chrome.storage.local.set({ products }, () => {
        console.log('Products saved:', products);
    });
}

let isSyncing = false;

async function syncProducts() {
    if (isSyncing) {
        return;
    }

    isSyncing = true;

    try {
        await onPrintfulPage();
    } finally {
        isSyncing = false;
    }
}

chrome.runtime.onMessage.addListener((message) => {
    if (message?.type === 'PRINTFUL_PAGE_READY') {
        syncProducts();
    }
});

if (window.location.href.includes('printful.me')) {
    syncProducts();
}