/**
 * SMYKKE - Haute Joaillerie & Scandinavian Luxury
 * Application Logic & Interactive Store Engine
 */

document.addEventListener('DOMContentLoaded', () => {

  // =========================================================================
  // Product Catalog Data
  // =========================================================================
  const PRODUCTS = [
    {
      id: 1,
      name: "Anillo Escultórico Solaris",
      category: "anillos",
      categoryLabel: "Anillos",
      basePrice: 200,
      originalPrice: 240,
      image: "assets/images/ring-solaris.jpg",
      badge: "Oferta -17%",
      rating: 5.0,
      reviewsCount: 42,
      description: "Una joya de silueta orgánica forjada a mano que captura la danza de la luz sobre el agua. Diseñada con contornos fluidos que se adaptan naturalmente a la anatomía del dedo.",
      specs: "Plata 925 maciza certificada con detalles en relieve pulidos a espejo. Hipoalergénico con baño anti-deslustre.",
      sizes: ["S (14-15 mm)", "M (16-17 mm)", "L (18-19 mm)", "Ajustable"]
    },
    {
      id: 2,
      name: "Collar Aura Solitaire",
      category: "collares",
      categoryLabel: "Collares",
      basePrice: 190,
      image: "assets/images/necklace-aura.jpg",
      badge: "Edición Limitada",
      rating: 4.9,
      reviewsCount: 28,
      description: "Cadena de eslabón veneciano ultraligero que sostiene una medalla esculpida con microdiamante engarzado en bisel. La síntesis perfecta del lujo discreto diario.",
      specs: "Largo regulable de 40 a 45 cm. Cierre reasa de seguridad grabado con sello SMYKKE 925.",
      sizes: ["40 cm", "45 cm", "50 cm"]
    },
    {
      id: 3,
      name: "Aros Lumina Perla Barroca",
      category: "pendientes",
      categoryLabel: "Pendientes",
      basePrice: 165,
      image: "assets/images/earrings-lumina.jpg",
      badge: "Favorito de Prensa",
      rating: 4.9,
      reviewsCount: 35,
      description: "Aros con textura forjada artesanalmente de los que suspende una perla barroca de agua dulce seleccionada a mano. Cada par posee matices únicos e irrepetibles.",
      specs: "Diámetro del aro: 24 mm. Perlas grado AA de 10-12 mm. Cierre criollo de click seguro.",
      sizes: ["Única"]
    },
    {
      id: 4,
      name: "Brazalete Rígido Nordic Flow",
      category: "pulseras",
      categoryLabel: "Pulseras",
      basePrice: 280,
      image: "assets/images/bracelet-nordic.jpg",
      badge: "Colección Atelier",
      rating: 5.0,
      reviewsCount: 19,
      description: "Brazalete tipo cuff con torsión sutil inspirada en las líneas aerodinámicas del diseño industrial danés. Cómodo, contundente y de tacto sedoso.",
      specs: "Ancho de banda: 6 mm. Plata esterlina 925 maciza de 28 gramos. Interior ergonómico contorneado.",
      sizes: ["S (15-16 cm)", "M (17-18 cm)", "L (19-20 cm)"]
    },
    {
      id: 5,
      name: "Gargantilla Hav de Perlas",
      category: "collares",
      categoryLabel: "Collares",
      basePrice: 320,
      image: "assets/images/choker-hav.jpg",
      badge: "Icono SMYKKE",
      rating: 5.0,
      reviewsCount: 54,
      description: "Una hilera continua de perlas barrocas naturales enlazadas con cierre marinero frontal en plata envejecida. Un clásico atemporal que transforma cualquier atuendo.",
      specs: "Largo total: 42 cm. Broche 'T-bar' forjado en plata maciza con sello nórdico de orfebrería.",
      sizes: ["40 cm", "42 cm", "45 cm"]
    },
    {
      id: 6,
      name: "Anillo Entrelazado Eos",
      category: "anillos",
      categoryLabel: "Anillos",
      basePrice: 175,
      image: "assets/images/ring-solaris.jpg",
      badge: "Nuevo",
      rating: 4.8,
      reviewsCount: 16,
      description: "Doble filamento esculpido que fluye como dos corrientes entrelazadas. Una declaración de estilo minimalista pensada para apilar o lucir en solitario.",
      specs: "Plata 925 de alto calibre con aleación libre de níquel. Resistente al agua y al uso diario continuo.",
      sizes: ["S (14-15 mm)", "M (16-17 mm)", "L (18-19 mm)"]
    }
  ];

  // =========================================================================
  // Currency & Rate Configuration
  // =========================================================================
  const CURRENCIES = {
    USD: { symbol: "$", rate: 1.0, code: "USD" },
    EUR: { symbol: "€", rate: 0.92, code: "EUR" },
    MXN: { symbol: "$", rate: 17.5, code: "MXN" },
    COP: { symbol: "$", rate: 3950, code: "COP" }
  };

  let currentCurrency = 'USD';

  function formatPrice(amountInUSD) {
    const config = CURRENCIES[currentCurrency] || CURRENCIES.USD;
    const converted = amountInUSD * config.rate;
    
    if (currentCurrency === 'COP') {
      return `${config.symbol}${Math.round(converted).toLocaleString('es-CO')} ${config.code}`;
    } else {
      return `${config.symbol}${converted.toFixed(2)} ${config.code}`;
    }
  }

  // =========================================================================
  // State: Cart & Wishlist
  // =========================================================================
  let cart = JSON.parse(localStorage.getItem('smykke_cart')) || [];
  let wishlist = JSON.parse(localStorage.getItem('smykke_wishlist')) || [];
  let currentPromo = localStorage.getItem('smykke_promo') || null;

  // Active filters & sorting
  let activeCategory = 'all';
  let activeSort = 'featured';

  // Modal active item state
  let currentModalProduct = null;
  let currentSelectedMetal = 'silver';
  let currentMetalMultiplier = 1.0;
  let currentSelectedSize = '';
  let currentModalQty = 1;

  // =========================================================================
  // DOM Elements
  // =========================================================================
  const productsGrid = document.getElementById('productsGrid');
  const cartDrawer = document.getElementById('cartDrawer');
  const wishlistDrawer = document.getElementById('wishlistDrawer');
  const drawerBackdrop = document.getElementById('drawerBackdrop');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const searchOverlay = document.getElementById('searchOverlay');
  const productModalBackdrop = document.getElementById('productModalBackdrop');
  const infoModalBackdrop = document.getElementById('infoModalBackdrop');

  const cartBadge = document.getElementById('cartBadge');
  const wishlistBadge = document.getElementById('wishlistBadge');
  const cartHeaderCount = document.getElementById('cartHeaderCount');
  const cartItemsList = document.getElementById('cartItemsList');
  const wishlistItemsList = document.getElementById('wishlistItemsList');

  const cartSubtotalEl = document.getElementById('cartSubtotal');
  const cartDiscountEl = document.getElementById('cartDiscount');
  const discountLine = document.getElementById('discountLine');
  const cartShippingEl = document.getElementById('cartShipping');
  const cartTotalEl = document.getElementById('cartTotal');
  const shippingProgressBar = document.getElementById('shippingProgressBar');
  const shippingProgressText = document.getElementById('shippingProgressText');

  const toastContainer = document.getElementById('toastContainer');

  // =========================================================================
  // Rendering: Product Catalog
  // =========================================================================
  function renderProducts() {
    if (!productsGrid) return;

    let filtered = [...PRODUCTS];

    if (activeCategory !== 'all') {
      filtered = filtered.filter(p => p.category === activeCategory);
    }

    if (activeSort === 'price-asc') {
      filtered.sort((a, b) => a.basePrice - b.basePrice);
    } else if (activeSort === 'price-desc') {
      filtered.sort((a, b) => b.basePrice - a.basePrice);
    } else if (activeSort === 'name-asc') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    productsGrid.innerHTML = '';

    if (filtered.length === 0) {
      productsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
          <p style="font-family: var(--font-serif); font-size: 1.5rem; color: var(--text-muted);">
            No encontramos joyas en esta categoría en este momento.
          </p>
        </div>
      `;
      return;
    }

    filtered.forEach(product => {
      const isWish = wishlist.includes(product.id);
      const card = document.createElement('article');
      card.className = 'product-card';
      card.setAttribute('data-id', product.id);

      card.innerHTML = `
        <div class="product-thumb-wrap">
          <img src="${product.image}" alt="${product.name}" class="product-thumb" loading="lazy">
          <span class="product-card-badge">${product.badge}</span>
          <button class="product-wish-btn ${isWish ? 'active' : ''}" 
                  data-action="wishlist" 
                  data-id="${product.id}" 
                  aria-label="Añadir a lista de deseos">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="${isWish ? '#E11D48' : 'none'}" stroke="currentColor" stroke-width="1.8">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
          <div class="product-card-actions">
            <button class="btn-card-action" data-action="quickview" data-id="${product.id}">
              Vista Rápida
            </button>
            <button class="btn-card-action primary-action" data-action="quickadd" data-id="${product.id}">
              Añadir +
            </button>
          </div>
        </div>
        <div class="product-body">
          <div class="product-meta-row">
            <span class="product-cat">${product.categoryLabel}</span>
            <span class="product-stars">&#9733; ${product.rating.toFixed(1)}</span>
          </div>
          <h3 class="product-name" data-action="quickview" data-id="${product.id}" style="cursor: pointer;">
            ${product.name}
          </h3>
          <p class="product-description-snippet">${product.description}</p>
          <div class="product-footer-row">
            ${product.originalPrice ? `
              <div class="product-price-stack">
                <span class="product-price-old">${formatPrice(product.originalPrice)}</span>
                <span class="product-price on-sale">${formatPrice(product.basePrice)}</span>
              </div>
            ` : `
              <span class="product-price">${formatPrice(product.basePrice)}</span>
            `}
            <div class="metal-indicators" title="Disponible en Plata 925, Vermeil Oro 18K y Oro Rosa">
              <span class="metal-dot silver" title="Plata 925"></span>
              <span class="metal-dot gold" title="Vermeil Oro 18K"></span>
              <span class="metal-dot rosegold" title="Oro Rosa 18K"></span>
            </div>
          </div>
        </div>
      `;

      productsGrid.appendChild(card);
    });
  }

  // =========================================================================
  // Cart Management
  // =========================================================================
  function saveCart() {
    localStorage.setItem('smykke_cart', JSON.stringify(cart));
    updateCartUI();
  }

  function addToCart(productId, metal = 'silver', metalName = 'Plata 925', multiplier = 1.0, size = 'M (16-17 mm)', qty = 1) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    const unitPrice = Math.round(product.basePrice * multiplier);
    const existingIndex = cart.findIndex(item => 
      item.productId === productId && item.metal === metal && item.size === size
    );

    if (existingIndex > -1) {
      cart[existingIndex].qty += qty;
    } else {
      cart.push({
        id: `${productId}-${metal}-${size}-${Date.now()}`,
        productId: product.id,
        name: product.name,
        category: product.categoryLabel,
        image: product.image,
        metal: metal,
        metalName: metalName,
        size: size,
        unitPrice: unitPrice,
        qty: qty
      });
    }

    saveCart();
    showToast(`"${product.name}" ha sido agregado a tu bolsa de compras.`);
    openCart();
  }

  function removeFromCart(cartItemId) {
    const item = cart.find(i => i.id === cartItemId);
    cart = cart.filter(i => i.id !== cartItemId);
    saveCart();
    if (item) {
      showToast(`Se eliminó "${item.name}" de la bolsa.`);
    }
  }

  function updateCartQty(cartItemId, delta) {
    const item = cart.find(i => i.id === cartItemId);
    if (!item) return;

    item.qty += delta;
    if (item.qty <= 0) {
      removeFromCart(cartItemId);
    } else {
      saveCart();
    }
  }

  function updateCartUI() {
    // Badges
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    cartBadge.textContent = totalItems;
    cartHeaderCount.textContent = `(${totalItems} ${totalItems === 1 ? 'pieza' : 'piezas'})`;

    if (!cartItemsList) return;

    if (cart.length === 0) {
      cartItemsList.innerHTML = `
        <div class="cart-empty-state">
          <svg class="cart-empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-2z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
          <h3 class="cart-empty-title">Tu bolsa está vacía</h3>
          <p class="cart-empty-desc">Explora nuestra colección y añade joyas esculpidas con metales nobles.</p>
          <button class="btn btn-primary" onclick="window.smykkeApp.closeDrawers(); location.href='#coleccion'">
            Ver Catálogo
          </button>
        </div>
      `;
      cartSubtotalEl.textContent = formatPrice(0);
      cartTotalEl.textContent = formatPrice(0);
      shippingProgressBar.style.width = '0%';
      shippingProgressText.innerHTML = `Agrega <strong>${formatPrice(150)}</strong> para obtener <strong>Envío Gratis</strong>`;
      if (discountLine) discountLine.style.display = 'none';
      return;
    }

    // Render Items
    cartItemsList.innerHTML = '';
    let subtotalUSD = 0;

    cart.forEach(item => {
      subtotalUSD += (item.unitPrice * item.qty);

      const row = document.createElement('div');
      row.className = 'cart-item-row';
      row.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="cart-item-thumb">
        <div class="cart-item-details">
          <h4 class="cart-item-name">${item.name}</h4>
          <span class="cart-item-meta">${item.metalName} &bull; ${item.size}</span>
          <span class="cart-item-price">${formatPrice(item.unitPrice)}</span>
          <div class="cart-item-controls">
            <button class="cart-qty-btn" data-action="decrease-qty" data-id="${item.id}">&minus;</button>
            <span class="cart-qty-num">${item.qty}</span>
            <button class="cart-qty-btn" data-action="increase-qty" data-id="${item.id}">&plus;</button>
          </div>
        </div>
        <button class="cart-item-remove" data-action="remove-item" data-id="${item.id}" title="Eliminar">&times;</button>
      `;
      cartItemsList.appendChild(row);
    });

    // Discount calculations
    let discountUSD = 0;
    if (currentPromo === 'SMYKKE10') {
      discountUSD = subtotalUSD * 0.10;
      if (discountLine) {
        discountLine.style.display = 'flex';
        cartDiscountEl.textContent = `-${formatPrice(discountUSD)}`;
      }
    } else {
      if (discountLine) discountLine.style.display = 'none';
    }

    const freeShippingThreshold = 150;
    const isFreeShipping = subtotalUSD >= freeShippingThreshold;
    const shippingUSD = isFreeShipping ? 0 : 15;

    cartSubtotalEl.textContent = formatPrice(subtotalUSD);
    cartShippingEl.textContent = isFreeShipping ? 'Gratis (Cortesía)' : formatPrice(15);
    const finalTotalUSD = (subtotalUSD - discountUSD) + shippingUSD;
    cartTotalEl.textContent = formatPrice(finalTotalUSD);

    // Free shipping progress
    const progressPercent = Math.min(100, Math.round((subtotalUSD / freeShippingThreshold) * 100));
    shippingProgressBar.style.width = `${progressPercent}%`;

    if (isFreeShipping) {
      shippingProgressText.innerHTML = `<span style="color: #15803D; font-weight: 600;">&#10003; ¡Felicidades! Tienes Envío Gratis Internacional</span>`;
    } else {
      const remaining = freeShippingThreshold - subtotalUSD;
      shippingProgressText.innerHTML = `Agrega <strong>${formatPrice(remaining)}</strong> más para obtener <strong>Envío Gratis</strong>`;
    }
  }

  // =========================================================================
  // Wishlist Management
  // =========================================================================
  function saveWishlist() {
    localStorage.setItem('smykke_wishlist', JSON.stringify(wishlist));
    updateWishlistUI();
    renderProducts(); // update heart icons in catalog
  }

  function toggleWishlist(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    const index = wishlist.indexOf(productId);
    if (index > -1) {
      wishlist.splice(index, 1);
      showToast(`"${product.name}" fue removido de tus guardados.`);
    } else {
      wishlist.push(productId);
      showToast(`"${product.name}" se guardó en tus piezas favoritas.`);
    }
    saveWishlist();
  }

  function updateWishlistUI() {
    wishlistBadge.textContent = wishlist.length;

    if (!wishlistItemsList) return;

    if (wishlist.length === 0) {
      wishlistItemsList.innerHTML = `
        <div class="cart-empty-state">
          <svg class="cart-empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
          <h3 class="cart-empty-title">Sin joyas guardadas</h3>
          <p class="cart-empty-desc">Toca el corazón en cualquier joya para conservarla en tu lista de deseos.</p>
        </div>
      `;
      return;
    }

    wishlistItemsList.innerHTML = '';
    wishlist.forEach(id => {
      const prod = PRODUCTS.find(p => p.id === id);
      if (!prod) return;

      const item = document.createElement('div');
      item.className = 'cart-item-row';
      item.innerHTML = `
        <img src="${prod.image}" alt="${prod.name}" class="cart-item-thumb">
        <div class="cart-item-details">
          <h4 class="cart-item-name">${prod.name}</h4>
          <span class="cart-item-meta">${prod.categoryLabel}</span>
          <span class="cart-item-price">${formatPrice(prod.basePrice)}</span>
          <button class="btn btn-primary" style="padding: 6px 12px; font-size: 0.72rem; margin-top: 6px; width: fit-content;"
                  data-action="wish-to-cart" data-id="${prod.id}">
            Mover a la Bolsa
          </button>
        </div>
        <button class="cart-item-remove" data-action="remove-wish" data-id="${prod.id}" title="Eliminar">&times;</button>
      `;
      wishlistItemsList.appendChild(item);
    });
  }

  // =========================================================================
  // Quick View Modal
  // =========================================================================
  function openProductModal(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    currentModalProduct = product;
    currentSelectedMetal = 'silver';
    currentMetalMultiplier = 1.0;
    currentModalQty = 1;

    // Fill elements
    document.getElementById('modalProductImg').src = product.image;
    document.getElementById('modalProductImg').alt = product.name;
    document.getElementById('modalBadge').textContent = product.badge;
    document.getElementById('modalCategory').textContent = product.categoryLabel;
    document.getElementById('modalTitle').textContent = product.name;
    document.getElementById('modalRatingText').textContent = `${product.rating.toFixed(1)} (${product.reviewsCount} reseñas verificadas)`;
    document.getElementById('modalDescription').textContent = product.description;
    document.getElementById('modalSpecs').textContent = product.specs;
    document.getElementById('modalQtyVal').textContent = currentModalQty;

    // Sizes
    const sizeContainer = document.getElementById('sizeSelector');
    sizeContainer.innerHTML = '';
    if (product.sizes && product.sizes.length > 0) {
      currentSelectedSize = product.sizes[0];
      document.getElementById('selectedSizeText').textContent = currentSelectedSize;
      product.sizes.forEach((s, idx) => {
        const btn = document.createElement('button');
        btn.className = `size-chip ${idx === 0 ? 'active' : ''}`;
        btn.setAttribute('data-size', s);
        btn.textContent = s;
        btn.addEventListener('click', () => {
          sizeContainer.querySelectorAll('.size-chip').forEach(c => c.classList.remove('active'));
          btn.classList.add('active');
          currentSelectedSize = s;
          document.getElementById('selectedSizeText').textContent = s;
        });
        sizeContainer.appendChild(btn);
      });
      document.getElementById('sizeSelectorGroup').style.display = 'block';
    } else {
      currentSelectedSize = 'Única';
      document.getElementById('sizeSelectorGroup').style.display = 'none';
    }

    // Reset metals to silver
    const metalButtons = document.querySelectorAll('.metal-option');
    metalButtons.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-metal') === 'silver');
    });
    document.getElementById('selectedMetalText').textContent = 'Plata de Ley 925';

    // Wishlist state inside modal
    const modalWishBtn = document.getElementById('modalWishlistBtn');
    modalWishBtn.classList.toggle('active', wishlist.includes(product.id));

    updateModalPrices();

    productModalBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function updateModalPrices() {
    if (!currentModalProduct) return;
    const price = Math.round(currentModalProduct.basePrice * currentMetalMultiplier);
    const totalPrice = price * currentModalQty;

    const modalPriceEl = document.getElementById('modalPrice');
    if (currentModalProduct.originalPrice) {
      const origPrice = Math.round(currentModalProduct.originalPrice * currentMetalMultiplier);
      modalPriceEl.innerHTML = `
        <span class="modal-price-old">${formatPrice(origPrice)}</span>
        <span class="modal-price-current">${formatPrice(price)}</span>
        <span class="modal-discount-pill">-17% OFF</span>
      `;
    } else {
      modalPriceEl.textContent = formatPrice(price);
    }

    document.getElementById('modalAddPrice').textContent = formatPrice(totalPrice);
  }

  function closeProductModal() {
    productModalBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  // =========================================================================
  // Drawers & Overlays Helpers
  // =========================================================================
  function openCart() {
    closeDrawers();
    cartDrawer.classList.add('open');
    drawerBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function openWishlist() {
    closeDrawers();
    wishlistDrawer.classList.add('open');
    drawerBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function openMobileMenu() {
    closeDrawers();
    mobileDrawer.classList.add('open');
    drawerBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function openSearch() {
    closeDrawers();
    searchOverlay.classList.add('open');
    document.getElementById('searchInput').focus();
    document.body.style.overflow = 'hidden';
  }

  function closeDrawers() {
    cartDrawer.classList.remove('open');
    wishlistDrawer.classList.remove('open');
    mobileDrawer.classList.remove('open');
    searchOverlay.classList.remove('open');
    drawerBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  // =========================================================================
  // Toast Notifications
  // =========================================================================
  function showToast(message, iconSvg = null) {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <div class="toast-icon">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 14 14"></polyline>
        </svg>
      </div>
      <span>${message}</span>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('removing');
      setTimeout(() => toast.remove(), 300);
    }, 3800);
  }

  // =========================================================================
  // Information Modal (Size Guide, Care, Shipping)
  // =========================================================================
  function openInfoModal(title, contentHtml) {
    const modalContent = document.getElementById('infoModalContent');
    modalContent.innerHTML = `
      <h2 style="font-family: var(--font-serif); font-size: 2.2rem; margin-bottom: 16px; color: var(--text-main);">${title}</h2>
      <div style="font-size: 0.92rem; color: var(--text-muted); line-height: 1.7;">
        ${contentHtml}
      </div>
    `;
    infoModalBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeInfoModal() {
    infoModalBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  // =========================================================================
  // Search Functionality
  // =========================================================================
  const searchInput = document.getElementById('searchInput');
  const searchResultsPreview = document.getElementById('searchResultsPreview');

  function handleSearch(term) {
    term = term.trim().toLowerCase();
    if (!searchResultsPreview) return;

    if (!term) {
      searchResultsPreview.innerHTML = '';
      return;
    }

    const matched = PRODUCTS.filter(p => 
      p.name.toLowerCase().includes(term) ||
      p.category.toLowerCase().includes(term) ||
      p.description.toLowerCase().includes(term) ||
      p.specs.toLowerCase().includes(term)
    );

    if (matched.length === 0) {
      searchResultsPreview.innerHTML = `
        <div style="color: #A8A29E; text-align: center; padding: 24px;">
          No se encontraron joyas que coincidan con "${term}".
        </div>
      `;
      return;
    }

    searchResultsPreview.innerHTML = '';
    matched.forEach(item => {
      const row = document.createElement('div');
      row.className = 'search-result-item';
      row.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="search-result-img">
        <div class="search-result-info">
          <h4 class="search-result-title">${item.name}</h4>
          <span class="search-result-price">${formatPrice(item.basePrice)} &bull; ${item.categoryLabel}</span>
        </div>
        <span style="color: var(--gold-light); font-size: 0.8rem;">Ver &rarr;</span>
      `;
      row.addEventListener('click', () => {
        closeDrawers();
        openProductModal(item.id);
      });
      searchResultsPreview.appendChild(row);
    });
  }

  // =========================================================================
  // Checkout Process Simulator
  // =========================================================================
  function proceedToCheckout() {
    if (cart.length === 0) {
      showToast('Tu bolsa de compras está vacía.');
      return;
    }

    const orderNum = Math.floor(100000 + Math.random() * 900000);
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

    const confirmationHtml = `
      <div style="text-align: center; padding: 10px 0;">
        <div style="width: 60px; height: 60px; background: var(--gold-subtle); color: var(--gold-primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px;">
          <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        <p style="font-size: 1.1rem; color: var(--text-main); margin-bottom: 8px;">
          <strong>¡Gracias por tu adquisición en SMYKKE Atelier!</strong>
        </p>
        <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 20px;">
          Tu orden <strong>#SMK-${orderNum}</strong> ha sido registrada con éxito.
        </p>
        <div style="background: var(--bg-card-alt); padding: 18px; border-radius: 6px; text-align: left; margin-bottom: 24px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
            <span>Piezas adquiridas:</span>
            <strong>${totalItems} unidades</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
            <span>Empaque de cortesía:</span>
            <strong>Estuche de nogal & lino</strong>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span>Tiempo de despacho:</span>
            <strong>24-48 horas con seguro total</strong>
          </div>
        </div>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 20px;">
          Hemos enviado la confirmación y el número de rastreo a tu correo electrónico registrado.
        </p>
        <button class="btn btn-primary" style="width: 100%;" onclick="window.smykkeApp.finishOrder()">
          Seguir Explorando el Atelier
        </button>
      </div>
    `;

    closeDrawers();
    openInfoModal(`Orden Confirmada #SMK-${orderNum}`, confirmationHtml);
  }

  function finishOrder() {
    cart = [];
    currentPromo = null;
    saveCart();
    closeInfoModal();
    showToast('¡Gracias por confiar en SMYKKE!');
  }

  // =========================================================================
  // Event Listeners Setup
  // =========================================================================

  // Announcement close
  const closeAnnouncementBtn = document.getElementById('closeAnnouncement');
  if (closeAnnouncementBtn) {
    closeAnnouncementBtn.addEventListener('click', () => {
      document.getElementById('announcementBar').classList.add('hidden');
    });
  }

  // Sticky header class
  window.addEventListener('scroll', () => {
    const siteHeader = document.getElementById('siteHeader');
    if (window.scrollY > 40) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  });

  // Currency select
  const currencySelect = document.getElementById('currencySelect');
  if (currencySelect) {
    currencySelect.addEventListener('change', (e) => {
      currentCurrency = e.target.value;
      renderProducts();
      updateCartUI();
      updateWishlistUI();
      updateModalPrices();
      updateCuratedBannerPrice();
      showToast(`Moneda cambiada a ${currentCurrency}`);
    });
  }

  // Action buttons header
  document.getElementById('cartOpenBtn').addEventListener('click', openCart);
  document.getElementById('cartCloseBtn').addEventListener('click', closeDrawers);
  document.getElementById('wishlistOpenBtn').addEventListener('click', openWishlist);
  document.getElementById('wishlistCloseBtn').addEventListener('click', closeDrawers);
  document.getElementById('mobileMenuBtn').addEventListener('click', openMobileMenu);
  document.getElementById('mobileDrawerClose').addEventListener('click', closeDrawers);
  document.getElementById('searchOpenBtn').addEventListener('click', openSearch);
  document.getElementById('searchCloseBtn').addEventListener('click', closeDrawers);
  drawerBackdrop.addEventListener('click', closeDrawers);

  // Search input
  if (searchInput) {
    searchInput.addEventListener('input', (e) => handleSearch(e.target.value));
  }

  document.querySelectorAll('.tag-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const val = btn.getAttribute('data-search');
      searchInput.value = val;
      handleSearch(val);
    });
  });

  // Auth buttons and floating agent panel
  document.querySelectorAll('.login-btn, .register-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const label = btn.textContent.trim();
      showToast(`${label} activado. Nuestros especialistas te ayudarán a elegir la pieza ideal.`);
    });
  });

  const agentToggle = document.getElementById('agentToggle');
  const agentPanel = document.getElementById('agentPanel');
  const agentClose = document.getElementById('agentClose');

  if (agentToggle && agentPanel) {
    agentToggle.addEventListener('click', () => {
      const isHidden = agentPanel.hasAttribute('hidden');
      if (isHidden) {
        agentPanel.removeAttribute('hidden');
      } else {
        agentPanel.setAttribute('hidden', 'hidden');
      }
    });
  }

  if (agentClose) {
    agentClose.addEventListener('click', () => agentPanel.setAttribute('hidden', 'hidden'));
  }

  document.querySelectorAll('.agent-option').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.getAttribute('data-agent-action');
      const messages = {
        style: 'Perfecto, te recomendamos una selección con líneas sobrias y una pieza focal en oro o plata 925.',
        gift: 'Te recomiendo una caja premium con nota personalizada, ideal para regalar un recuerdo elegante y atemporal.',
        size: 'Nuestra guía de tallas está disponible en el modal de cada pieza; te asesoramos para elegir la mejor medida.'
      };
      showToast(messages[action] || 'Te ayudamos a elegir la pieza perfecta.');
      if (agentPanel) agentPanel.setAttribute('hidden', 'hidden');
    });
  });

  // Modal events
  document.getElementById('modalCloseBtn').addEventListener('click', closeProductModal);
  productModalBackdrop.addEventListener('click', (e) => {
    if (e.target === productModalBackdrop) closeProductModal();
  });

  // Modal metal choices
  const metalButtons = document.querySelectorAll('.metal-option');
  metalButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      metalButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentSelectedMetal = btn.getAttribute('data-metal');
      currentMetalMultiplier = parseFloat(btn.getAttribute('data-price-mult'));
      const text = btn.querySelector('span:last-child').textContent;
      document.getElementById('selectedMetalText').textContent = text;
      updateModalPrices();
    });
  });

  // Modal Quantity
  document.getElementById('modalQtyMinus').addEventListener('click', () => {
    if (currentModalQty > 1) {
      currentModalQty--;
      document.getElementById('modalQtyVal').textContent = currentModalQty;
      updateModalPrices();
    }
  });

  document.getElementById('modalQtyPlus').addEventListener('click', () => {
    currentModalQty++;
    document.getElementById('modalQtyVal').textContent = currentModalQty;
    updateModalPrices();
  });

  // Modal Add to Cart
  document.getElementById('modalAddToCartBtn').addEventListener('click', () => {
    if (!currentModalProduct) return;
    const metalLabel = document.getElementById('selectedMetalText').textContent;
    addToCart(
      currentModalProduct.id,
      currentSelectedMetal,
      metalLabel,
      currentMetalMultiplier,
      currentSelectedSize,
      currentModalQty
    );
    closeProductModal();
  });

  // Modal Wishlist toggle
  document.getElementById('modalWishlistBtn').addEventListener('click', () => {
    if (!currentModalProduct) return;
    toggleWishlist(currentModalProduct.id);
    document.getElementById('modalWishlistBtn').classList.toggle('active', wishlist.includes(currentModalProduct.id));
  });

  // Category Filter Chips
  const filterChips = document.querySelectorAll('.filter-chip');
  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      activeCategory = chip.getAttribute('data-category');
      renderProducts();
    });
  });

  // Sort Select
  const sortSelect = document.getElementById('sortSelect');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      activeSort = e.target.value;
      renderProducts();
    });
  }

  // Delegated events for products grid
  if (productsGrid) {
    productsGrid.addEventListener('click', (e) => {
      const wishBtn = e.target.closest('[data-action="wishlist"]');
      if (wishBtn) {
        const id = parseInt(wishBtn.getAttribute('data-id'), 10);
        toggleWishlist(id);
        return;
      }

      const quickAddBtn = e.target.closest('[data-action="quickadd"]');
      if (quickAddBtn) {
        const id = parseInt(quickAddBtn.getAttribute('data-id'), 10);
        addToCart(id, 'silver', 'Plata 925', 1.0, 'M (16-17 mm)', 1);
        return;
      }

      const quickView = e.target.closest('[data-action="quickview"]');
      if (quickView) {
        const id = parseInt(quickView.getAttribute('data-id'), 10);
        openProductModal(id);
        return;
      }
    });
  }

  // Delegated events for Cart Drawer
  if (cartDrawer) {
    cartDrawer.addEventListener('click', (e) => {
      const removeBtn = e.target.closest('[data-action="remove-item"]');
      if (removeBtn) {
        removeFromCart(removeBtn.getAttribute('data-id'));
        return;
      }

      const incBtn = e.target.closest('[data-action="increase-qty"]');
      if (incBtn) {
        updateCartQty(incBtn.getAttribute('data-id'), 1);
        return;
      }

      const decBtn = e.target.closest('[data-action="decrease-qty"]');
      if (decBtn) {
        updateCartQty(decBtn.getAttribute('data-id'), -1);
        return;
      }
    });
  }

  // Delegated events for Wishlist Drawer
  if (wishlistDrawer) {
    wishlistDrawer.addEventListener('click', (e) => {
      const removeWishBtn = e.target.closest('[data-action="remove-wish"]');
      if (removeWishBtn) {
        const id = parseInt(removeWishBtn.getAttribute('data-id'), 10);
        toggleWishlist(id);
        return;
      }

      const moveToCartBtn = e.target.closest('[data-action="wish-to-cart"]');
      if (moveToCartBtn) {
        const id = parseInt(moveToCartBtn.getAttribute('data-id'), 10);
        addToCart(id, 'silver', 'Plata 925', 1.0, 'M (16-17 mm)', 1);
        toggleWishlist(id);
        return;
      }
    });
  }

  // Promo code in Cart
  const promoApplyBtn = document.getElementById('promoApplyBtn');
  const promoInput = document.getElementById('promoInput');
  const promoNotice = document.getElementById('promoNotice');

  if (promoApplyBtn && promoInput) {
    promoApplyBtn.addEventListener('click', () => {
      const code = promoInput.value.trim().toUpperCase();
      if (code === 'SMYKKE10') {
        currentPromo = 'SMYKKE10';
        localStorage.setItem('smykke_promo', 'SMYKKE10');
        promoNotice.textContent = '¡Cupón del 10% aplicado con éxito!';
        promoNotice.className = 'promo-notice success';
        updateCartUI();
        showToast('Código de descuento SMYKKE10 aplicado.');
      } else {
        promoNotice.textContent = 'Código no válido. Prueba con SMYKKE10.';
        promoNotice.className = 'promo-notice error';
      }
    });
  }

  // Checkout button
  const checkoutBtn = document.getElementById('checkoutBtn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', proceedToCheckout);
  }

  // Newsletter form
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('newsletterEmail').value;
      showToast(`¡Bienvenida a SMYKKE! Te enviamos tu código de 10% a ${email}`);
      newsletterForm.reset();
    });
  }

  // Information Modals triggers
  document.getElementById('infoModalClose').addEventListener('click', closeInfoModal);
  infoModalBackdrop.addEventListener('click', (e) => {
    if (e.target === infoModalBackdrop) closeInfoModal();
  });

  const sizeGuideBtn = document.getElementById('sizeGuideBtn');
  const openSizeGuideModal = document.getElementById('openSizeGuideModal');

  const sizeGuideHtml = `
    <p>Para determinar la medida exacta de tu anillo o muñeca, sigue estas recomendaciones del taller:</p>
    <table style="width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 0.85rem;">
      <thead>
        <tr style="border-bottom: 2px solid var(--border-gold); text-align: left;">
          <th style="padding: 8px;">Talla SMYKKE</th>
          <th style="padding: 8px;">Diámetro Interior</th>
          <th style="padding: 8px;">Circunferencia</th>
        </tr>
      </thead>
      <tbody>
        <tr style="border-bottom: 1px solid var(--border-light);"><td style="padding: 8px;">S</td><td style="padding: 8px;">15.3 mm</td><td style="padding: 8px;">48 mm</td></tr>
        <tr style="border-bottom: 1px solid var(--border-light);"><td style="padding: 8px;">M</td><td style="padding: 8px;">16.5 mm</td><td style="padding: 8px;">52 mm</td></tr>
        <tr style="border-bottom: 1px solid var(--border-light);"><td style="padding: 8px;">L</td><td style="padding: 8px;">17.8 mm</td><td style="padding: 8px;">56 mm</td></tr>
        <tr><td style="padding: 8px;">Ajustable</td><td style="padding: 8px;">15 - 19 mm</td><td style="padding: 8px;">Adaptable a mano</td></tr>
      </tbody>
    </table>
    <p><strong>Consejo:</strong> Mide el dedo al final del día cuando la temperatura corporal es estable. Si estás entre dos tallas, te recomendamos elegir la mayor.</p>
  `;

  if (sizeGuideBtn) sizeGuideBtn.addEventListener('click', (e) => {
    e.preventDefault();
    openInfoModal('Guía de Tallas & Dimensiones', sizeGuideHtml);
  });

  if (openSizeGuideModal) openSizeGuideModal.addEventListener('click', () => {
    openInfoModal('Guía de Tallas & Dimensiones', sizeGuideHtml);
  });

  const careGuideBtn = document.getElementById('careGuideBtn');
  if (careGuideBtn) careGuideBtn.addEventListener('click', (e) => {
    e.preventDefault();
    openInfoModal('Cuidados de la Plata 925 y Oro 18K', `
      <p>Nuestras piezas están forjadas para acompañarte toda la vida si sigues estos sencillos rituales:</p>
      <ul style="padding-left: 20px; margin: 14px 0; display: flex; flex-direction: column; gap: 8px;">
        <li><strong>Evita el contacto directo</strong> con perfumes, cloro de piscinas y químicos abrasivos.</li>
        <li><strong>Guarda tus joyas individualmente</strong> en la bolsa de ante SMYKKE para evitar fricción superficial.</li>
        <li><strong>Limpia regularmente</strong> con el paño abrillantador que incluimos en tu pedido para mantener el brillo de la plata de ley.</li>
        <li><strong>Perlas naturales:</strong> Son gemas orgánicas delicadas. Límpialas únicamente con un paño húmedo suave.</li>
      </ul>
    `);
  });

  const shippingInfoBtn = document.getElementById('shippingInfoBtn');
  if (shippingInfoBtn) shippingInfoBtn.addEventListener('click', (e) => {
    e.preventDefault();
    openInfoModal('Envíos Internacionales & Devoluciones', `
      <p>Todos nuestros envíos salen de nuestro taller en Copenhague en embalajes neutros asegurados:</p>
      <ul style="padding-left: 20px; margin: 14px 0; display: flex; flex-direction: column; gap: 8px;">
        <li><strong>Envíos Express:</strong> 2 a 5 días hábiles a cualquier destino internacional vía DHL Express.</li>
        <li><strong>Envío de Cortesía:</strong> Gratuito en todas las órdenes mayores a $150 USD / 140€.</li>
        <li><strong>Devoluciones sin complicaciones:</strong> Dispones de 30 días para cambio de talla o devolución completa si la joya conserva su estado original.</li>
      </ul>
    `);
  });

  const warrantyBtn = document.getElementById('warrantyBtn');
  if (warrantyBtn) warrantyBtn.addEventListener('click', (e) => {
    e.preventDefault();
    openInfoModal('Certificado de Autenticidad SMYKKE', `
      <p>Cada pieza manufacturada en nuestro estudio cuenta con un sello de orfebrería registrado y una tarjeta de autenticidad que garantiza:</p>
      <ul style="padding-left: 20px; margin: 14px 0; display: flex; flex-direction: column; gap: 8px;">
        <li>Pureza certificada de Plata Esterlina 925 y Oro 18 Quilates.</li>
        <li>Extracción ética y metales reciclados certificados por el Responsible Jewellery Council (RJC).</li>
        <li>Garantía de servicio de mantenimiento, pulido y ajuste de por vida.</li>
      </ul>
    `);
  });

  // Mobile links auto-close
  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', closeDrawers);
  });

  // Expose global methods for inline clicks
  window.smykkeApp = {
    openProductModal,
    closeDrawers,
    filterCategory: (cat) => {
      activeCategory = cat;
      filterChips.forEach(c => c.classList.toggle('active', c.getAttribute('data-category') === cat));
      renderProducts();
    },
    finishOrder
  };

  // Curated banner price sync
  function updateCuratedBannerPrice() {
    const curatedPriceOld = document.getElementById('curatedPriceOld');
    const curatedPriceNew = document.getElementById('curatedPriceNew');
    if (curatedPriceOld) curatedPriceOld.textContent = formatPrice(240);
    if (curatedPriceNew) curatedPriceNew.textContent = formatPrice(200);
  }

  // =========================================================================
  // Initial Render
  // =========================================================================
  renderProducts();
  updateCuratedBannerPrice();
  updateCartUI();
  updateWishlistUI();

});
