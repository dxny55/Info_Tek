import { createProductCard, animarProductoAlCarrito } from "../src/components/productCard/productCard.js";
import { initCompareModal } from "../src/components/compareModal/compareModal.js";
import { aplicarFiltros } from "./filtros.js";

const contenedor = document.getElementById("lista-productos");
const contador = document.getElementById("contador-productos");
const botonesCategorias = document.querySelectorAll(".categoria-btn");
const btnCompararFinal = document.getElementById("btn-comparar-final");
const btnCuenta = document.getElementById("btn-cuenta");
const compareModal = initCompareModal();


let seleccionados = [];

let productosOriginales = [];
let productosFiltrados = [];

// ===============================
// MOSTRAR PRODUCTOS (🔥 MODIFICADO ASÍNCROLO PARA CORAZÓN ROJO)
// ===============================
async function renderizarProductos(lista) {
    contenedor.innerHTML = "";

    // 1. Obtener favoritos desde el backend antes de pintar
    const usuario = JSON.parse(localStorage.getItem("user"));
    let idsFavoritos = [];
    
    if (usuario) {
        const userId = usuario.id || usuario._id;
        try {
            const res = await fetch(`http://localhost:3000/api/favoritos/${userId}`);
            const favs = await res.json();
            idsFavoritos = favs.map(f => {
                if (!f.productoId) return null;
                return typeof f.productoId === 'object' ? f.productoId._id : f.productoId;
            }).filter(id => id !== null);
        } catch (err) {
            console.error("Error al obtener favoritos iniciales:", err);
        }
    }

    // 2. Renderizar pasando el estado 'esFav' a la tarjeta
    lista.forEach(p => {
        const esFav = idsFavoritos.includes(p._id);

        const card = createProductCard(
            p,
            verDetalle,
            añadirCarrito,
            toggleComparar,
            toggleFavorito,
            esFav // <-- Enviamos el estado dinámico (true/false)
        );
        contenedor.appendChild(card);
    });

    if (contador) contador.textContent = `${lista.length} productos`;
}

// ===============================
// ACTIVAR FILTROS
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
            buscador.value = "";
            precioMin.value = "";
            precioMax.value = "";
            checkboxes.forEach(cb => cb.checked = false);

            productosFiltrados = [...productosOriginales];
            renderizarProductos(productosFiltrados);
        });
    }
}


// ===============================
// TOAST
// ===============================
/*function mostrarToast(mensaje) {
    const toast = document.getElementById("toast");
    toast.innerHTML = mensaje;
    toast.classList.add("show");

    setTimeout(() => toast.classList.remove("show"), 2500);
}*/

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
  /* mostrarToast(`
        ✔ Producto añadido al carrito<br>
        <a href="carrito.html" style="color:#ffd700; text-decoration:underline;">Ir al carrito</a>
    `);*/
}

// ===============================
// CARGAR PRODUCTOS (🔥 CORREGIDO EL FLUJO INICIAL)
// ===============================
fetch("http://localhost:3000/api/productos")
    .then(res => res.json())
    .then(data => {
        productosOriginales = data;   // ← ← ← IMPORTANTE
        productosFiltrados = [...data];
        window.productos = data;

        // 🔥 CORRECCIÓN: Quitamos mostrarProductos(productos) para evitar el doble pintado en gris
        renderizarProductos(productosFiltrados);
        activarFiltros();
    })
    .catch(err => console.error("Error cargando productos:", err));

// ===============================
// MOSTRAR PRODUCTOS (🔥 SE ENLAZA DIRECTAMENTE PARA NO ROMPER A TUS COMPAÑEROS)
// ===============================
function mostrarProductos(lista) {
    renderizarProductos(lista);
}

// ===============================
// FILTRO POR CATEGORÍAS
// ===============================
botonesCategorias.forEach(btn => {
    btn.addEventListener("click", () => {
        botonesCategorias.forEach(b => b.classList.remove("activo"));
        btn.classList.add("activo");
    });
});

// ===============================
// FAVORITOS (🔥 SE MANTIENE TU FUNCIÓN CORREGIDA)
// ===============================
function toggleFavorito(producto, boton) {
    const usuario = JSON.parse(localStorage.getItem("user"));

    if (!usuario) {
        alert("Debes iniciar sesión");
        return;
    }

    const activo = boton.classList.contains("activo");
    const bodyData = {
        usuarioId: usuario.id || usuario._id,
        productoId: producto._id
    };

    if (!activo) {
        // AGREGAR A FAVORITOS
        fetch("http://localhost:3000/api/favoritos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(bodyData)
        })
        .then(res => {
            if(res.ok) boton.classList.add("activo");
        })
        .catch(err => console.error("Error al guardar favorito:", err));

    } else {
        // ELIMINAR DE FAVORITOS
        fetch("http://localhost:3000/api/favoritos", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(bodyData)
        })
        .then(res => {
            if(res.ok) boton.classList.remove("activo");
        })
        .catch(err => console.error("Error al eliminar favorito:", err));
    }
}

// ===============================
// COMPARAR (SIN CAMBIOS)
// ===============================
function toggleComparar(id, boton) {

    const producto = productosOriginales.find(p => p._id === id);

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
        alert("Selecciona al menos 2 productos");
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

// CUENTA
btnCuenta.addEventListener("click", () => {
    window.location.href = "./account.html";
});
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

// COLOR (INTACTO - VOLVEMOS A DARLE SOPORTE)
const colorGuardado = localStorage.getItem("colorFondo");

if (colorGuardado) {
    document.documentElement.style.setProperty("--color-fondo", colorGuardado);
    if (typeof selectorColor !== 'undefined') selectorColor.value = colorGuardado;
}

if (typeof selectorColor !== 'undefined') {
    selectorColor.addEventListener("input", (e) => {
        const nuevoColor = e.target.value;
        document.documentElement.style.setProperty("--color-fondo", nuevoColor);
        localStorage.setItem("colorFondo", nuevoColor);
    });
}