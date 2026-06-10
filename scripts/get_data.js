

 function getProduct() {
         return new Promise((resolve) => {
            setTimeout(() => {
             const products = [];

             document.querySelectorAll('a[href*="/product/"]').forEach(link => {
                 const card = link.closest('article, div');
                 const img = card?.querySelector('img');
                 products.push({
                    title: link.innerText.split('\n')[0].trim(),
                    url: link.href,
                    image: img?.src || ''
                });
            

            resolve(products);}, 4000);
        })
            
    });
}


async function onPrintfulPage() {
    const products = await getProduct();
    chrome.storage.local.set({ products }, () => {
        console.log('Products saved:', products);
    });
}

 const currentTab = chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        if (activeTab.url.includes('printful.me')) {
            onPrintfulPage();
        }
    });