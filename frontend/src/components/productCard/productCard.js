export function createProductCard(producto, onVer, onFavorito, onComparar) {

    const card = document.createElement("div");
    card.classList.add("producto-card");

    const imagen = producto.imagenes?.[0]
        ? "../" + producto.imagenes[0].replace("frontend/", "")
        : "../recursos/imagenes/default.jpg";

    // comprobar si ya es favorito
    const favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
    const esFavorito = favoritos.some(p => p._id === producto._id);

    card.innerHTML = `
        <img class="producto-img" src="${imagen}" alt="${producto.nombre}">
        <h3 class="producto-nombre">${producto.nombre}</h3>
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

    // abrir producto
    card.addEventListener("click", () => onVer(producto));

    // botón comparar
    card.querySelector(".btn-comparar").addEventListener("click", (e) => {
        e.stopPropagation();
        onComparar(producto._id, e.currentTarget);
    });

    // botón favoritos
    card.querySelector(".btn-favorito").addEventListener("click", (e) => {
        e.stopPropagation();
        onFavorito(producto, e.currentTarget);
    });

    return card;
}