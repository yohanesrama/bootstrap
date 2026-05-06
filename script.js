// GLOBAL STATE
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ELEMENTS
const cartPanel = document.getElementById("cartPanel");
const cartItems = document.getElementById("cartItems");
const productGrid = document.getElementById("productGrid");
const productModal = document.getElementById("productModal");

// --- CAROUSEL ---
const slides = document.querySelectorAll(".carousel-slide");
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");
let currentSlide = 0;

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.classList.toggle("active", i === index);
    });
}

if (prevBtn && nextBtn) {
    prevBtn.addEventListener("click", () => {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    });

    nextBtn.addEventListener("click", () => {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    });

    // Auto slide
    setInterval(() => {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }, 5000);

    // Init first slide
    showSlide(0);
}

// --- PRODUCT GRID ---
function renderHomeProducts() {
    if (!productGrid) return;
    productGrid.innerHTML = "";
    
    // Show only first 3 products on home
    const homeProducts = PRODUCTS.slice(0, 3);
    
    homeProducts.forEach(p => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
            <div class="card-media" style="background-image:url('${p.img}')"></div>
            <div class="card-body">
                <h3>${p.title}</h3>
                <p>${p.price}</p>
            </div>
        `;
        card.addEventListener("click", () => openModal(p));
        productGrid.appendChild(card);
    });
}

// --- MODAL ---
function openModal(p) {
    if (!productModal) return;
    
    document.getElementById("productImg").src = p.img;
    document.getElementById("productTitle").innerText = p.title;
    document.getElementById("productPrice").innerText = p.price;
    document.getElementById("productDesc").innerText = p.desc;
    
    productModal.classList.add("active");
    
    // Set actions
    document.getElementById("addToCart").onclick = () => {
        addToCart(p);
        closeModal();
        toggleCart();
    };
    
    document.getElementById("buyNow").onclick = () => {
        addToCart(p);
        window.location.href = "checkout.html";
    };
}

function closeModal() {
    if (productModal) productModal.classList.remove("active");
}

const modalClose = document.querySelector(".modal-close");
if (modalClose) {
    modalClose.onclick = closeModal;
}

window.onclick = (e) => {
    if (e.target === productModal) closeModal();
};

// --- CART LOGIC ---
function addToCart(product) {
    const item = cart.find(i => i.id === product.id);
    if (item) {
        item.qty++;
    } else {
        cart.push({ ...product, qty: 1 });
    }
    saveCart();
}

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartUI();
}

function updateCartUI() {
    if (!cartItems) return;
    cartItems.innerHTML = "";
    
    let total = 0;
    cart.forEach(item => {
        const price = parseInt(item.price.replace(/\D/g, '')) || 0;
        total += price * item.qty;
        
        const div = document.createElement("div");
        div.className = "cart-item";
        div.style.display = "flex";
        div.style.gap = "10px";
        div.style.marginBottom = "15px";
        div.style.alignItems = "center";
        
        div.innerHTML = `
            <img src="${item.img}" style="width:60px;height:60px;object-fit:cover;border-radius:8px;">
            <div style="flex:1;">
                <strong style="color:#fff;">${item.title}</strong><br>
                <span style="color:var(--gold-1);font-weight:600;font-size:14px;">Rp ${price.toLocaleString()}</span><br>
                <div style="display:flex; align-items:center; gap:8px; margin-top:8px;">
                    <button class="btn-ghost" style="padding:2px 8px; border-radius:4px;" onclick="changeQty(${item.id}, -1)">-</button>
                    <span style="color:#fff;">${item.qty}</span>
                    <button class="btn-ghost" style="padding:2px 8px; border-radius:4px;" onclick="changeQty(${item.id}, 1)">+</button>
                </div>
            </div>
            <button class="btn-ghost" style="padding:5px 8px; border:none; background:transparent; color:#ff4d4d; font-size:16px;" onclick="removeItem(${item.id})">❌</button>
        `;
        cartItems.appendChild(div);
    });
    
    if (cart.length > 0) {
        cartItems.innerHTML += `
            <hr style="margin:15px 0; border:0; border-top:1px solid rgba(255,255,255,0.1);">
            <h3 style="margin-bottom:15px;">Total: Rp ${total.toLocaleString()}</h3>
            <a href="checkout.html" class="btn btn-primary" style="display:block; text-align:center; margin-bottom:10px;">Checkout</a>
            <a href="cart.html" class="btn btn-ghost" style="display:block; text-align:center; margin-bottom:10px;">View Full Cart</a>
            <button onclick="toggleCart()" class="btn btn-ghost" style="width:100%;">Tutup</button>
        `;
    } else {
        cartItems.innerHTML = "<p>Keranjang masih kosong.</p>";
    }
}

function changeQty(id, delta) {
    const item = cart.find(i => i.id === id);
    if (item) {
        item.qty += delta;
        if (item.qty <= 0) {
            removeItem(id);
        } else {
            saveCart();
        }
    }
}

function removeItem(id) {
    cart = cart.filter(i => i.id !== id);
    saveCart();
}

function toggleCart() {
    if (cartPanel) {
        cartPanel.classList.toggle("active");
        const overlay = document.getElementById("cartOverlay");
        if (overlay) {
            overlay.classList.toggle("active");
        }
        
        if (cartPanel.classList.contains("active")) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
    }
}

// EXPOSE GLOBALS
window.changeQty = changeQty;
window.removeItem = removeItem;
window.toggleCart = toggleCart;

// INIT
renderHomeProducts();
updateCartUI();