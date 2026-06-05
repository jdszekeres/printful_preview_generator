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
        chrome.windows.create({ url: 'view.html', type: 'popup', width: 800, height: 600 });
    });

});

function start() {
    updateProductEndings(productEndings);

    fetchProducts().then(products => {
        prods = [...products];
        const productList = document.getElementById('products_ul');
        products.slice(0, 5).forEach(product => {
            const listItem = document.createElement('li');
            listItem.textContent = product.title;
            productList.appendChild(listItem);
        });
        
        document.getElementById('product_count').textContent = products.length - 5;

        updateHTML();
    });
}

start();