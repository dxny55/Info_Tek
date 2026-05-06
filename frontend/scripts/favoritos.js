import { createProductCard } from "../src/components/productCard/productCard.js";

const contenedor = document.getElementById("lista-favoritos");
const contador = document.getElementById("contador-productos");

const usuarioId = localStorage.getItem("usuarioId");

async function cargarFavoritos() {

    if (!usuarioId) {
        contenedor.innerHTML = "<p>Inicia sesión</p>";
        return;
    }

    const resFav = await fetch(`http://localhost:3000/api/favoritos/${usuarioId}`);
    const favoritos = await resFav.json();

    const resProd = await fetch("http://localhost:3000/api/productos");
    const productos = await resProd.json();

    const productosFav = productos.filter(p =>
        favoritos.some(f => f.productoId === p._id)
    );

    contenedor.innerHTML = "";

    productosFav.forEach(p => {

        const card = createProductCard(
            p,
            verDetalle,
            eliminarFavorito,
            () => {},
            productosFav.map(x => x._id)
        );

        contenedor.appendChild(card);
    });

    contador.textContent = `${productosFav.length} productos`;
}

cargarFavoritos();

function verDetalle(producto) {
    window.location.href = `producto.html?id=${producto._id}`;
}

async function eliminarFavorito(producto) {

    await fetch("http://localhost:3000/api/favoritos", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            usuarioId,
            productoId: producto._id
        })
    });

    cargarFavoritos();
}