export function createProductCard(producto, onVer, onCarrito, onComparar) {
    const card = document.createElement("div");
    card.classList.add("producto-card");

    // Imagen principal del producto
    const imagen = producto.imagenes?.[0]
        ? "../" + producto.imagenes[0]
        : "../recursos/imagenes/default.jpg";

    card.innerHTML = `
        <img class="producto-img" src="${imagen}" alt="${producto.nombreCorto}">
        
        <h3 class="producto-nombre">${producto.nombreLargo}</h3>

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

    // Toda la card abre el producto
    card.addEventListener("click", () => onVer(producto));

    // Evitar que los botones internos activen el click de la card
    card.querySelector(".btn-comparar").addEventListener("click", (e) => {
        e.stopPropagation();
        onComparar(producto._id, e.currentTarget);
    });

    card.querySelector(".btn-favorito").addEventListener("click", (e) => {
        e.stopPropagation();
        onCarrito(producto);
    });

    return card;
}
