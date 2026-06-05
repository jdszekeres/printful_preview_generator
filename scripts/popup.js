var prods = [];
var productEndings = [
    "Matte Poster",
    "Canvas Print",
];


async function fetchProducts() {
return new Promise((resolve) => {
    chrome.storage.local.get('products', (result) => {
        console.log('Products retrieved:', result.products);
        resolve(result.products);
    });
});
}


function updateProductEndings(endings) {
    const productEndingsList = document.getElementById('product_endings_ul');
    productEndingsList.innerHTML = '';
    endings.forEach(ending => {
        const listItem = document.createElement('li');
        listItem.textContent = ending;
        productEndingsList.appendChild(listItem);
    });

    //get unique products with ending list
    const uniqueProducts = new Set(prods.map(product => {
        for(const ending of endings){
            if(product.title.endsWith(ending)){
                return product.title.slice(0,-ending.length).trim();
            }
        }
        return product.title;
    }));

    console.log('Unique products:', uniqueProducts);

    document.getElementById('unique_products').textContent = uniqueProducts.size;

}

function updateHTML() {
    const html = generateHTML(JSON.stringify(prods), JSON.stringify(productEndings));
    const htmlElement = document.getElementById('html_output');
    htmlElement.textContent = html;

    hljs.highlightElement(htmlElement, { language: 'html' });
}

document.getElementById('add_ending_button').addEventListener('click', () => {
    const newEnding = document.getElementById('new_ending_input').value.trim();
    if (newEnding && !productEndings.includes(newEnding)) {
        productEndings.push(newEnding);
        updateProductEndings(productEndings);
        document.getElementById('new_ending_input').value = '';
        updateHTML(); 
    }
});


document.getElementById('preview_button').addEventListener('click', () => {
    const html = GenerateHTMLNoJS(JSON.stringify(prods), JSON.stringify(productEndings));

    chrome.storage.local.set({ previewHtml: html }, () => {
        chrome.windows.create({ url: 'pages/preview.html', type: 'popup', width: 800, height: 600 });
    });

});

function start() {

    const currentTab = chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        if (!activeTab.url.includes('printful.me')) {
            document.documentElement.innerHTML = '<div style="width: 500px; height: 200px;"><h1 style="color: red; text-align: center; margin-top: 50px;">Please navigate to a Printful product page to use this extension.</h1></div>';
            return;
        }
    });

    updateProductEndings(productEndings);

    fetchProducts().then(products => {
        prods = [...products];
        const productList = document.getElementById('products_ul');
        products.slice(0, 5).forEach(product => {
            const listItem = document.createElement('li');
            listItem.textContent = product.title;
            productList.appendChild(listItem);
        });

        updateProductEndings(productEndings);

        
        document.getElementById('product_count').textContent = products.length - 5;

        updateHTML();
    });
}

start();