// ===============================
// GENERAR ESTRELLAS
// ===============================
function generarEstrellas(rating) {
    if (!rating) return "☆☆☆☆☆";
    const llenas = Math.floor(rating);
    const vacias = 5 - llenas;
    return "★".repeat(llenas) + "☆".repeat(vacias);
}

// ===============================
// ANIMACIÓN: PRODUCTO VUELA AL CARRITO
// ===============================
export function animarProductoAlCarrito(imagenSrc, origenX, origenY) {
    const carritoIcon = document.getElementById("btn-carrito-nav");
    if (!carritoIcon) return;

    const destino = carritoIcon.getBoundingClientRect();

    const img = document.createElement("img");
    img.src = imagenSrc;
    img.classList.add("fly-img");

    img.style.left = origenX + "px";
    img.style.top = origenY + "px";

    document.body.appendChild(img);

    setTimeout(() => {
        img.style.transform = `translate(${destino.left - origenX}px, ${destino.top - origenY}px) scale(0.2)`;
        img.style.opacity = "0";
    }, 50);

    setTimeout(() => img.remove(), 900);
}

// ===============================
// CREAR CARD DE PRODUCTO
// ===============================
export function createProductCard(producto, onVer, onCarrito, onComparar) {
    const card = document.createElement("div");
    card.classList.add("producto-card");

    const imagen = producto.imagenes?.[0]
        ? "../" + producto.imagenes[0]
        : "../recursos/imagenes/default.jpg";

    card.innerHTML = `
        <img class="producto-img" src="${imagen}" alt="${producto.nombreCorto}">
        
        <h3 class="producto-nombre">${producto.nombreLargo}</h3>

        <div class="producto-rating">
            <span class="stars">${generarEstrellas(producto.rating)}</span>
            <span class="rating-number">${producto.rating ? producto.rating.toFixed(1) : "N/A"}</span>
        </div>

        <p class="producto-precio">${producto.precio} €</p>

        <div class="botones-producto">
            <button class="btn-favorito">
                <img src="../recursos/imagenes/corazon.png" alt="favoritos">
            </button>

            <button class="btn-comparar">
                <img src="../recursos/imagenes/comparar.png" alt="comparar">
            </button>
        </div>
    `;

    // Abrir producto
    card.addEventListener("click", () => onVer(producto));

    // Comparar
    card.querySelector(".btn-comparar").addEventListener("click", (e) => {
        e.stopPropagation();
        onComparar(producto._id, e.currentTarget);
    });

    // Añadir al carrito con animación
    card.querySelector(".btn-favorito").addEventListener("click", (e) => {
    e.stopPropagation();
    const img = card.querySelector(".producto-img");
    const rect = img.getBoundingClientRect();

    onCarrito(producto, e.currentTarget, e);

    animarProductoAlCarrito(
        imagen,
        rect.left,
        rect.top
    );
});


    return card;
}
