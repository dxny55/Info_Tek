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
// MOSTRAR PRODUCTOS
// ===============================
function renderizarProductos(lista) {
    contenedor.innerHTML = "";

    lista.forEach(p => {
        const card = createProductCard(
            p,
            verDetalle,
            añadirCarrito,
            toggleComparar,
            toggleFavorito
        );
        contenedor.appendChild(card);
    });

    contador.textContent = `${lista.length} productos`;
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

        // 1) Primero aplicamos los filtros normales (categoría, marca, precio)
        let lista = aplicarFiltros(productosOriginales);

        // 2) Ahora filtramos por texto (nombreLargo)
        const texto = buscador.value.trim().toLowerCase();

        if (texto.length > 0) {
            lista = lista.filter(p =>
                (p.nombreLargo || "").toLowerCase().includes(texto)
            );
        }

        // 3) Renderizamos la lista final
        renderizarProductos(lista);
    };

    // Eventos
    if (buscador) buscador.addEventListener("input", actualizar);
    if (precioMin) precioMin.addEventListener("input", actualizar);
    if (precioMax) precioMax.addEventListener("input", actualizar);
    checkboxes.forEach(cb => cb.addEventListener("change", actualizar));

    // Botón limpiar
    const btnLimpiar = document.getElementById("btn-limpiar-filtros");
    if (btnLimpiar) {
        btnLimpiar.addEventListener("click", () => {
            buscador.value = "";
            precioMin.value = "";
            precioMax.value = "";
            checkboxes.forEach(cb => cb.checked = false);

            renderizarProductos(productosOriginales);
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
  /*  mostrarToast(`
        ✔ Producto añadido al carrito<br>
        <a href="carrito.html" style="color:#ffd700; text-decoration:underline;">Ir al carrito</a>
    `);*/
}

// ===============================
// CARGAR PRODUCTOS
// ===============================
fetch("http://localhost:3000/api/productos")
    .then(res => res.json())
    .then(data => {
        productosOriginales = data;   // ← ← ← IMPORTANTE
        productosFiltrados = [...data];
        window.productos = data;
        mostrarProductos(productos);

        renderizarProductos(productosFiltrados);
        activarFiltros();
    })
    .catch(err => console.error("Error cargando productos:", err));

// ===============================
// MOSTRAR PRODUCTOS
// ===============================
function mostrarProductos(lista) {

    contenedor.innerHTML = "";

    lista.forEach(p => {

        const card = createProductCard(
            p,
            verDetalle,
            toggleFavorito,
            toggleComparar
        );

        contenedor.appendChild(card);
    });

    contador.textContent = `${lista.length} productos`;
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
// FAVORITOS (🔥 MODIFICADO)
// ===============================
function toggleFavorito(producto, boton) {
    // 1. Corregido: Usar 'boton' en lugar de 'btn'
    // const cat = boton.dataset.cat; // ¿Realmente necesitas la categoría aquí?

    const usuario = JSON.parse(localStorage.getItem("user"));

    if (!usuario) {
        alert("Debes iniciar sesión");
        return;
    }

    // --- COMENTO ESTA SECCIÓN ---
    // Esta lógica de filtrar categorías NO debería estar en la función de Favoritos.
    // Favoritos solo debe guardar o quitar el producto.
    /*
    if (cat === "Todos") {
        mostrarProductos(productos);
        return;
    }
    const categoriaMongo = mapaCategorias[cat];
    const filtrados = productos.filter(p => p.categoria === categoriaMongo);
    */
    // ----------------------------

    const activo = boton.classList.contains("activo");

    if (!activo) {
        // AGREGAR A FAVORITOS
        fetch("http://localhost:3000/api/favoritos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                usuarioId: usuario.id,
                productoId: producto._id
            })
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
            body: JSON.stringify({
                usuarioId: usuario.id,
                productoId: producto._id
            })
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

// COLOR (SIN CAMBIOS)
const colorGuardado = localStorage.getItem("colorFondo");

if (colorGuardado) {
    document.documentElement.style.setProperty("--color-fondo", colorGuardado);
    selectorColor.value = colorGuardado;
}

selectorColor.addEventListener("input", (e) => {
    const nuevoColor = e.target.value;
    document.documentElement.style.setProperty("--color-fondo", nuevoColor);
    localStorage.setItem("colorFondo", nuevoColor);
});