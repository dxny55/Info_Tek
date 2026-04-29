import { aplicarFiltros } from "./filtros.js";
import { createProductCard } from "../src/components/productCard/productCard.js";

let productosOriginales = [];
let productosFiltrados = [];

export async function cargarProductos() {
    console.log("Cargando productos...");

    const contenedor = document.getElementById("lista-productos");

    if (!contenedor) {
        console.error("ERROR: No existe #lista-productos en el HTML");
        return;
    }

    try {
        const res = await fetch("http://localhost:3000/api/productos");
        const data = await res.json();

        productosOriginales = data;
        productosFiltrados = [...productosOriginales];

        renderizarProductos(productosFiltrados);
        activarFiltros();

    } catch (err) {
        console.error("Error cargando productos:", err);
    }
}

function renderizarProductos(lista) {
    const contenedor = document.getElementById("lista-productos");
    contenedor.innerHTML = "";

    const contador = document.getElementById("contador-productos");
    if (contador) contador.textContent = `${lista.length} productos`;

    if (lista.length === 0) {
        contenedor.innerHTML = `<p>No hay productos disponibles.</p>`;
        return;
    }

    lista.forEach(producto => {
        const card = createProductCard(
            producto,
            onVerProducto,
            onFavorito,
            onComparar
        );
        contenedor.appendChild(card);
    });
}

// ===============================
// CALLBACKS NECESARIOS
// ===============================

// abrir producto individual
function onVerProducto(producto) {
    let id = producto._id;
    if (id && typeof id === "object" && id.$oid) id = id.$oid;
    window.location.href = `./producto.html?id=${id}`;
}

// favoritos (mínimo funcional)
function onFavorito(producto, boton) {
    boton.classList.toggle("activo");
}

// comparar (mínimo funcional)
function onComparar(idProducto, boton) {
    boton.classList.toggle("activo");
}

// ===============================
// FILTROS
// ===============================

function activarFiltros() {
    const buscador = document.getElementById("filtro-texto");
    const precioMin = document.getElementById("precio-min");
    const precioMax = document.getElementById("precio-max");
    const checkboxes = document.querySelectorAll(".filtro-categoria, .filtro-marca");

    const actualizar = () => {
        productosFiltrados = aplicarFiltros(productosOriginales);
        renderizarProductos(productosFiltrados);
    };

    if (buscador) buscador.addEventListener("input", actualizar);
    if (precioMin) precioMin.addEventListener("input", actualizar);
    if (precioMax) precioMax.addEventListener("input", actualizar);
    checkboxes.forEach(cb => cb.addEventListener("change", actualizar));

    const btnLimpiar = document.getElementById("btn-limpiar-filtros");
    if (btnLimpiar) {
        btnLimpiar.addEventListener("click", () => {
            if (buscador) buscador.value = "";
            if (precioMin) precioMin.value = "";
            if (precioMax) precioMax.value = "";
            checkboxes.forEach(cb => cb.checked = false);

            productosFiltrados = [...productosOriginales];
            renderizarProductos(productosFiltrados);
        });
    }
}

cargarProductos();
