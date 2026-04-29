import { createProductCard, animarProductoAlCarrito } from "../src/components/productCard/productCard.js";
import { initCompareModal } from "../src/components/compareModal/compareModal.js";
import { aplicarFiltros } from "./filtros.js";


let productosOriginales = [];
let productosFiltrados = [];

const contenedor = document.getElementById("lista-productos");
const contador = document.getElementById("contador-productos");
const botonesCategorias = document.querySelectorAll(".categoria-btn");
const btnCompararFinal = document.getElementById("btn-comparar-final");
const btnCuenta = document.getElementById("btn-cuenta");
const compareModal = initCompareModal();

window.productos = [];
let seleccionados = [];

// ===============================
// TOAST
// ===============================
function mostrarToast(mensaje) {
    const toast = document.getElementById("toast");
    toast.innerHTML = mensaje;
    toast.classList.add("show");

    setTimeout(() => toast.classList.remove("show"), 2500);
}

// ===============================
// CONTADOR DEL CARRITO
// ===============================
function actualizarContadorCarrito() {
    const span = document.getElementById("carrito-count");
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const total = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    if (span) span.textContent = total;
}

// ===============================
// AÑADIR AL CARRITO (REAL)
// ===============================
function añadirCarrito(producto, boton, event) {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    const index = carrito.findIndex(item => item.id === producto._id);

    if (index === -1) {
        carrito.push({
            id: producto._id,
            nombre: producto.nombreCorto,
            precio: producto.precio,
            cantidad: 1,
            imagen: producto.imagenes?.[0] || null
        });
    } else {
        carrito[index].cantidad += 1;
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarContadorCarrito();

    // Animación desde la card
    const cardImg = event.target.closest(".producto-card").querySelector(".producto-img");
    const rect = cardImg.getBoundingClientRect();

    animarProductoAlCarrito(
        "../" + (producto.imagenes?.[0] || "recursos/imagenes/placeholder.png"),
        rect.left,
        rect.top
    );

    // Toast
    mostrarToast(`
        ✔ Producto añadido al carrito<br>
        <a href="carrito.html" style="color:#ffd700; text-decoration:underline;">Ir al carrito</a>
    `);
}

// ===============================
// CARGAR PRODUCTOS
// ===============================
fetch("http://localhost:3000/api/productos")
    .then(res => res.json())
    .then(data => {
        window.productos = data;
        mostrarProductos(productos);
    })
    .catch(err => console.error("Error cargando productos:", err));

function mostrarProductos(lista) {
    contenedor.innerHTML = "";

    lista.forEach(p => {
        const card = createProductCard(
            p,
            verDetalle,
            añadirCarrito,
            toggleComparar
        );
        contenedor.appendChild(card);
    });

    contador.textContent = `${lista.length} productos`;
}

// ===============================
// FILTRO POR CATEGORÍAS
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

botonesCategorias.forEach(btn => {
    btn.addEventListener("click", () => {
        botonesCategorias.forEach(b => b.classList.remove("activo"));
        btn.classList.add("activo");

        const cat = btn.dataset.cat;

        if (cat === "Todos") {
            mostrarProductos(productos);
            return;
        }

        const categoriaMongo = mapaCategorias[cat];
        const filtrados = productos.filter(p => p.categoria === categoriaMongo);

        mostrarProductos(filtrados);
    });
});

// ===============================
// COMPARAR
// ===============================
function toggleComparar(id, boton) {
    const producto = productos.find(p => p._id === id);

    if (seleccionados.length === 0) {
        seleccionados.push(producto);
        boton.classList.add("seleccionado");
        return;
    }

    if (producto.categoria !== seleccionados[0].categoria) {
        alert("Solo puedes comparar productos de la misma categoría");
        return;
    }

    const index = seleccionados.findIndex(p => p._id === id);
    if (index !== -1) {
        seleccionados.splice(index, 1);
        boton.classList.remove("seleccionado");
        return;
    }

    seleccionados.push(producto);
    boton.classList.add("seleccionado");
}

btnCompararFinal.addEventListener("click", () => {
    if (seleccionados.length < 2) {
        alert("Selecciona al menos 2 productos para comparar.");
        return;
    }
    compareModal.abrir(seleccionados);
});

// ===============================
// VER DETALLE
// ===============================
function verDetalle(producto) {
    window.location.href = `producto.html?id=${producto._id}`;
}

// ===============================
// NAVBAR: IR AL CARRITO
// ===============================
const btnCarritoNav = document.getElementById("btn-carrito-nav");
if (btnCarritoNav) {
    btnCarritoNav.addEventListener("click", () => {
        window.location.href = "./carrito.html";
    });
}

// Inicializar contador
actualizarContadorCarrito();
