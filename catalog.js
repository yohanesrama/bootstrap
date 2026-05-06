// GLOBAL
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ELEMENT
const grid = document.getElementById("catalogGrid");
const filter = document.getElementById("filter");
const searchInput = document.getElementById("searchInput");
const cartItems = document.getElementById("cartItems");
const cartPanel = document.getElementById("cartPanel");
const productModal = document.getElementById("productModal");

// RENDER PRODUCT
function renderProducts(list) {
    if (!grid) return;
    grid.innerHTML = "";

    list.forEach(p => {
        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <div class="card-media" style="background-image:url('${p.img}')"></div>
            <div class="card-body">
                <h3>${p.title}</h3>
                <p>${p.price}</p>
                <button class="buy-btn btn btn-primary" style="width:100%; margin-top:10px;">Beli</button>
            </div>
        `;

        card.addEventListener("click", () => openModal(p));
        
        const buyBtn = card.querySelector(".buy-btn");
        buyBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            addToCart(p);
            toggleCart();
        });

        grid.appendChild(card);
    });
}

// MODAL
function openModal(p) {
    if (!productModal) return;
    
    document.getElementById("productImg").src = p.img;
    document.getElementById("productTitle").innerText = p.title;
    document.getElementById("productPrice").innerText = p.price;
    document.getElementById("productDesc").innerText = p.desc;
    
    productModal.classList.add("active");
    
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

// ADD TO CART
function addToCart(product) {
    const item = cart.find(i => i.id === product.id);
    if (item) {
        item.qty++;
    } else {
        cart.push({ ...product, qty: 1 });
    }
    saveCart();
}

// SAVE
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartUI();
}

// UPDATE CART UI
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
                    <button class="btn-ghost" style="padding:2px 8px; border-radius:4px;" onclick="decrease(${item.id})">-</button>
                    <span style="color:#fff;">${item.qty}</span>
                    <button class="btn-ghost" style="padding:2px 8px; border-radius:4px;" onclick="increase(${item.id})">+</button>
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
            <button onclick="goCheckout()" class="btn btn-primary" style="width:100%; margin-bottom:10px;">Checkout</button>
            <a href="cart.html" class="btn btn-ghost" style="display:block; text-align:center; margin-bottom:10px;">View Full Cart</a>
            <button onclick="toggleCart()" class="btn btn-ghost" style="width:100%;">Tutup</button>
        `;
    } else {
        cartItems.innerHTML = "<p>Keranjang kosong</p>";
    }
}

// ACTION
function increase(id) {
    const item = cart.find(i => i.id === id);
    if (item) {
        item.qty++;
        saveCart();
    }
}

function decrease(id) {
    const item = cart.find(i => i.id === id);
    if (item) {
        item.qty--;
        if (item.qty <= 0) {
            cart = cart.filter(i => i.id !== id);
        }
        saveCart();
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

function goCheckout() {
    window.location.href = "checkout.html";
}

// FILTER
function update() {
    const keyword = searchInput.value.toLowerCase();
    const category = filter.value;

    const filtered = PRODUCTS.filter(p =>
        p.title.toLowerCase().includes(keyword) &&
        (category === "all" || p.category === category)
    );

    renderProducts(filtered);
}

// EVENT
if (filter) filter.onchange = update;
if (searchInput) searchInput.oninput = update;

// GLOBAL EXPOSE
window.increase = increase;
window.decrease = decrease;
window.removeItem = removeItem;
window.toggleCart = toggleCart;
window.goCheckout = goCheckout;

// INIT
renderProducts(PRODUCTS);
updateCartUI();

// Close modal on click outside
window.onclick = (e) => {
    if (e.target === productModal) closeModal();
};