export function createProductCard(producto, onVer, onFavorito, onComparar) {

    const card = document.createElement("div");
    card.classList.add("producto-card");

    const imagen = producto.imagenes?.[0]
        ? "../" + producto.imagenes[0]
        : "../recursos/imagenes/default.jpg";

    // 🔥 ahora ya no usamos localStorage
    const esFavorito = false;

    card.innerHTML = `
        <img class="producto-img" src="${imagen}" alt="${producto.nombreCorto}">
        
        <h3 class="producto-nombre">${producto.nombreLargo}</h3>

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

    card.addEventListener("click", () => onVer(producto));

    card.querySelector(".btn-comparar").addEventListener("click", (e) => {
        e.stopPropagation();
        onComparar(producto._id, e.currentTarget);
    });

    card.querySelector(".btn-favorito").addEventListener("click", (e) => {
        e.stopPropagation();
        onFavorito(producto, e.currentTarget);
    });

    return card;
}