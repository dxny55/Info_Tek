
export function createProductCard(producto, onVer, onCarrito, onComparar) {
    const card = document.createElement("div");
    card.classList.add("producto-card");

    const imagen = producto.imagenes?.[0]
        ? "/" + producto.imagenes[0]
        : "/frontend/recursos/imagenes/default.jpg";

    card.innerHTML = `
        <img class="producto-img" src="${imagen}" alt="${producto.nombre}">
        <h3 class="producto-nombre">${producto.nombre}</h3>
        <p class="producto-precio">${producto.precio} €</p>

        <div class="botones-producto">
            <button class="btn-ver">Ver más</button>
            <button class="btn-carrito">Añadir al carrito</button>
            <button class="btn-comparar">Comparar</button>
        </div>
    `;

    // Eventos
    card.querySelector(".btn-ver").addEventListener("click", () => onVer(producto));
    card.querySelector(".btn-carrito").addEventListener("click", () => onCarrito(producto));
    card.querySelector(".btn-comparar").addEventListener("click", (e) => onComparar(producto, e.target));

    return card;
}
