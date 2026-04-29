<<<<<<< HEAD
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
=======
export function createProductCard(producto, onVer, onFavorito, onComparar) {

>>>>>>> origin/Continuardetallodelproducto
    const card = document.createElement("div");
    card.classList.add("producto-card");

    const imagen = producto.imagenes?.[0]
        ? "../" + producto.imagenes[0]
        : "../recursos/imagenes/default.jpg";

    // comprobar si ya es favorito
    const favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
    const esFavorito = favoritos.some(p => p._id === producto._id);

    card.innerHTML = `
        <img class="producto-img" src="${imagen}" alt="${producto.nombreCorto}">
        
        <h3 class="producto-nombre">${producto.nombreLargo}</h3>

<<<<<<< HEAD
        <div class="producto-rating">
            <span class="stars">${generarEstrellas(producto.rating)}</span>
            <span class="rating-number">${producto.rating ? producto.rating.toFixed(1) : "N/A"}</span>
        </div>

=======
>>>>>>> origin/Continuardetallodelproducto
        <p class="producto-precio">${producto.precio} €</p>

        <div class="botones-producto">
            <button class="btn-favorito ${esFavorito ? "activo" : ""}">
                <img src="../recursos/imagenes/corazon.png">
            </button>

            <button class="btn-comparar">
                <img src="../recursos/imagenes/comparar.png">
            </button>
        </div>
    `;

<<<<<<< HEAD
    // Abrir producto
    card.addEventListener("click", () => onVer(producto));

    // Comparar
=======
    // abrir producto
    card.addEventListener("click", () => onVer(producto));

    // botón comparar
>>>>>>> origin/Continuardetallodelproducto
    card.querySelector(".btn-comparar").addEventListener("click", (e) => {
        e.stopPropagation();
        onComparar(producto._id, e.currentTarget);
    });

<<<<<<< HEAD
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

=======
    // botón favoritos
    card.querySelector(".btn-favorito").addEventListener("click", (e) => {
        e.stopPropagation();
        onFavorito(producto, e.currentTarget);
    });
>>>>>>> origin/Continuardetallodelproducto

    return card;
}