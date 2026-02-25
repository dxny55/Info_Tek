export function createProductCard(producto, onVer, onCarrito, onComparar) {
    const card = document.createElement("div");
    card.classList.add("producto-card");

    // Construcción correcta de la ruta de imagen
    const imagen = producto.imagenes?.[0]
        ? "../" + producto.imagenes[0].replace("frontend/", "")
        : "../recursos/imagenes/default.jpg";

    card.innerHTML = `
        <img class="producto-img" src="${imagen}" alt="${producto.nombre}">
        <h3 class="producto-nombre">${producto.nombre}</h3>
        <p class="producto-precio">${producto.precio} €</p>

        <div class="botones-producto">
            <button class="btn-comparar">
                <img src="../recursos/imagenes/comparar.png" alt="comparar">
            </button>
        </div>
    `;

    // Evento del botón comparar
    const btnComparar = card.querySelector(".btn-comparar");

    btnComparar.addEventListener("click", (e) => {
        e.stopPropagation();

        const boton = e.currentTarget; // SIEMPRE el botón, no la imagen

        // Llamamos a toggleComparar con el ID y el botón
        onComparar(producto._id, boton);
    });

    return card;
}
