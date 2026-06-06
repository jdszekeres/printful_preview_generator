function generateHTML(productsJson, productEndingsJson) {
    return `
<style>
body{
    font-family:Arial,sans-serif;
    margin:20px;
}

#js-search{
    width:100%;
    max-width:500px;
    margin:0 auto 30px;
    display:block;
    padding:12px;
    font-size:16px;
    border:1px solid #ccc;
    border-radius:8px;
    box-sizing:border-box;
}

#js-gallery{
    display:grid;
    grid-template-columns:repeat(auto-fill,minmax(280px,1fr));
    gap:24px;
    max-width:1400px;
    margin:auto;
}

.js-card{
    background:#fff;
    border-radius:12px;
    overflow:hidden;
    box-shadow:0 2px 10px rgba(0,0,0,.08);
    transition:.2s;
}

.js-card:hover{
    transform:translateY(-4px);
    box-shadow:0 8px 24px rgba(0,0,0,.15);
}

.js-card img{
    width:100%;
    display:block;
}

.js-card h3{
    margin:16px;
    text-align:center;
    font-size:18px;
}

.js-buttons{
    display:flex;
    flex-wrap:wrap;
    gap:8px;
    padding:0 16px 16px;
}

.js-buttons a{
    flex:1;
    min-width:120px;
    text-align:center;
    text-decoration:none;
    padding:10px;
    border:1px solid #333;
    border-radius:6px;
    color:#333;
    font-weight:600;
    box-sizing:border-box;
}

.js-buttons a:hover{
    background:#333;
    color:#fff;
}
</style>



<div id="js-gallery"></div>

<script>

const products = ${productsJson};

// Add new product types here in the future if desired
const PRODUCT_SUFFIXES = ${productEndingsJson};

function splitProduct(title){

    for(const suffix of PRODUCT_SUFFIXES){

        if(title.endsWith(suffix)){
            return {
                baseName:title.slice(0,-suffix.length).trim(),
                variant:suffix
            };
        }
    }

    return {
        baseName:title,
        variant:"Product"
    };
}

function buildGalleryData(products){

    const grouped = new Map();

    products.forEach(product => {

        const info = splitProduct(product.title);

        if (!grouped.has(info.baseName)) {

            grouped.set(info.baseName, {
                title: info.baseName,
                image: product.image,
                variants: []
            });
        }

        grouped.get(info.baseName).variants.push({
            name: info.variant,
            url: product.url
        });
    });

    return [...grouped.values()];
}

const galleryData = buildGalleryData(products);
const gallery = document.getElementById("js-gallery");

function render(filter=''){

    gallery.innerHTML='';

    galleryData
        .filter(item =>
            item.title.toLowerCase().includes(filter.toLowerCase())
        )
        .forEach(item=>{

            const buttons = item.variants
                .map(v=>\`
                    <a href="\${v.url}" target="_blank">
                        \${v.name}
                    </a>
                \`)
                .join('');

            gallery.insertAdjacentHTML('beforeend',\`
                <div class="js-card">
                    <img
                        loading="lazy"
                        src="\${item.image}"
                        alt="\${item.title}">
                    <h3>\${item.title}</h3>
                    <div class="js-buttons">
                        \${buttons}
                    </div>
                </div>
            \`);
        });
}

render();

</script>
`

}

function GenerateHTMLNoJS(productsJson, productEndingsJson) {

    const doc = new DOMParser().parseFromString(generateHTML(productsJson, productEndingsJson), 'text/html');
    const products = JSON.parse(productsJson);

    // Add new product types here in the future if desired
    const PRODUCT_SUFFIXES = JSON.parse(productEndingsJson);

    function splitProduct(title){

        for(const suffix of PRODUCT_SUFFIXES){

            if(title.endsWith(suffix)){
                return {
                    baseName:title.slice(0,-suffix.length).trim(),
                    variant:suffix
                };
            }
        }

        return {
            baseName:title,
            variant:"Product"
        };
    }

    function buildGalleryData(products){

        const grouped = new Map();

        products.forEach(product => {

            const info = splitProduct(product.title);

            if (!grouped.has(info.baseName)) {

                grouped.set(info.baseName, {
                    title: info.baseName,
                    image: product.image,
                    variants: []
                });
            }

            grouped.get(info.baseName).variants.push({
                name: info.variant,
                url: product.url
            });
        });

        return [...grouped.values()];
    }

    const galleryData = buildGalleryData(products);
    const gallery = doc.getElementById("js-gallery");

    function render(filter=''){

        gallery.innerHTML='';

        galleryData
            .filter(item =>
                item.title.toLowerCase().includes(filter.toLowerCase())
            )
            .forEach(item=>{

                const buttons = item.variants
                    .map(v=>`
                        <a href="${v.url}" target="_blank">
                            ${v.name}
                        </a>
                    `)
                    .join('');

                gallery.insertAdjacentHTML('beforeend',`
                    <div class="js-card">
                        <img
                            loading="lazy"
                            src="${item.image}"
                            alt="${item.title}">
                        <h3>${item.title}</h3>
                        <div class="js-buttons">
                            ${buttons}
                        </div>
                    </div>
                `);
            });
    }

    render();


    return doc.documentElement.outerHTML;
}