// Cuando el documento HTML ha sido completamente cargado y parseado, se ejecuta la función que obtiene las categorías y muestra todos los productos
document.addEventListener('DOMContentLoaded', () => {
    fetchCategories();
    displayAllProducts();
});

// Función asíncrona que obtiene todas las categorías desde la API
async function fetchCategories() {
    try {
        const response = await fetch('https://fakestoreapi.com/products/categories');
        const categories = await response.json();
        
        const categoriesList = document.getElementById('categories');
        
        categories.forEach(category => {
            const li = document.createElement('li');
            li.textContent = category;
            li.addEventListener('click', () => fetchProductsByCategory(category));
            categoriesList.appendChild(li);
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
}

// Función asíncrona que obtiene todas las categorías desde la API (reutilizable)
async function fetchCategoriesFromAPI() {
    try {
        const response = await fetch('https://fakestoreapi.com/products/categories');
        const categories = await response.json();
        return categories;
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
}

// Función asíncrona que obtiene los productos de una categoría específica desde la API (reutilizable)
async function fetchProductsByCategoryFromAPI(category) {
    try {
        const response = await fetch(`https://fakestoreapi.com/products/category/${category}`);
        const products = await response.json();
        return products;
    } catch (error) {
        console.error(`Error fetching products for category ${category}:`, error);
        return [];
    }
}

// Función asíncrona que obtiene todos los productos de todas las categorías
async function fetchAllProducts() {
    const categories = await fetchCategoriesFromAPI();
    let allProducts = [];
    
    for (const category of categories) {
        const products = await fetchProductsByCategoryFromAPI(category);
        allProducts = allProducts.concat(products);
    }
    
    return allProducts;
}

// Función para mostrar todos los productos en la pantalla principal
async function displayAllProducts() {
    try {
        const products = await fetchAllProducts();
        
        const productList = document.getElementById('product-list');
        productList.innerHTML = '';
        
        products.forEach(product => {
            const productDiv = document.createElement('div');
            productDiv.classList.add('product'); 
            productDiv.innerHTML = `
                <h3>${product.title}</h3>
                <img src="${product.image}" alt="${product.title}">
                <p>Price: $${product.price}</p>
                <button onclick="viewProductDetail(${product.id})">Ver Detalle</button>
            `;
            productList.appendChild(productDiv);
        });
    } catch (error) {
        console.error('Error displaying products:', error);
    }
}

// Función asíncrona que obtiene los productos de una categoría específica desde la API y los muestra
async function fetchProductsByCategory(category) {
    try {
        const products = await fetchProductsByCategoryFromAPI(category);
        
        const productList = document.getElementById('product-list');
        productList.innerHTML = '';
        
        products.forEach(product => {
            const productDiv = document.createElement('div');
            productDiv.classList.add('product'); 
            productDiv.innerHTML = `
                <h3>${product.title}</h3>
                <img src="${product.image}" alt="${product.title}">
                <p>Price: $${product.price}</p>
                <button onclick="viewProductDetail(${product.id})">Ver Detalle</button>
            `;
            productList.appendChild(productDiv);
        });
    } catch (error) {
        console.error(`Error fetching products for category ${category}:`, error);
    }
}

// Función asíncrona que obtiene los detalles de un producto específico desde la API
async function viewProductDetail(productId) {
    try {
        const response = await fetch(`https://fakestoreapi.com/products/${productId}`);
        const product = await response.json();
        
        const productDetail = document.getElementById('product-detail');
        productDetail.innerHTML = `
            <h2>${product.title}</h2>
            <img src="${product.image}" alt="${product.title}">
            <p>${product.description}</p>
            <p>Price: $${product.price}</p>
            <button onclick="addToCart(${product.id}, '${product.title}', ${product.price})">Agregar al Carrito</button>
        `;
        
        productDetail.classList.remove('hidden');
    } catch (error) {
        console.error('Error fetching product detail:', error);
    }
}

const cart = [];

// Función que añade un producto al carrito
function addToCart(id, title, price) {
    cart.push({ id, title, price });
    updateCart();
}

// Función que actualiza la vista del carrito
function updateCart() {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';
    
    let total = 0;
    
    cart.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.title} - $${item.price}`;
        cartItems.appendChild(li);
        total += item.price;
    });
    
    document.getElementById('cart-total').textContent = total.toFixed(2);
    document.getElementById('cart').classList.remove('hidden');
}
