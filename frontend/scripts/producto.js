// Obtener ID desde la URL
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

// Elementos del DOM
const imgEl = document.getElementById("producto-imagen");
const nombreEl = document.getElementById("producto-nombre");
const precioActualEl = document.getElementById("producto-precio-actual");
const precioAnteriorEl = document.getElementById("producto-precio-anterior");
const descuentoEl = document.getElementById("producto-descuento");
const ratingEl = document.getElementById("producto-rating");
const stockEl = document.getElementById("producto-stock");
const especificacionesEl = document.getElementById("producto-especificaciones");
const btnCarrito = document.getElementById("btn-carrito");

// Cargar producto desde el backend
async function cargarProducto() {
    try {
        const res = await fetch(`http://localhost:3000/api/productos/${id}`);
        const producto = await res.json();

        if (!producto) {
            nombreEl.textContent = "Producto no encontrado";
            return;
        }

        // Imagen
        imgEl.src = producto.imagen || "../recursos/imagenes/placeholder.png";

        // Nombre
        nombreEl.textContent = producto.nombre;

        // Precio
        precioActualEl.textContent = producto.precio + " €";

        // Precio anterior (simulado)
        precioAnteriorEl.textContent = (producto.precio * 1.10).toFixed(2) + " €";

        // Descuento (simulado)
        descuentoEl.textContent = "-10%";

        // Rating (simulado)
        ratingEl.textContent = "4.8";

        // Stock
        stockEl.textContent = `Stock disponible: ${producto.stock} unidades`;

        // Especificaciones (si no existen, se crea una lista básica)
        especificacionesEl.innerHTML = "";

        if (producto.descripcion) {
            const li = document.createElement("li");
            li.textContent = producto.descripcion;
            especificacionesEl.appendChild(li);
        }

        if (producto.marca) {
            const li = document.createElement("li");
            li.textContent = "Marca: " + producto.marca;
            especificacionesEl.appendChild(li);
        }

        // Botón añadir al carrito
        btnCarrito.addEventListener("click", () => agregarAlCarrito(producto));

    } catch (error) {
        console.error("Error cargando producto:", error);
    }
}

cargarProducto();

// -------------------------
// CARRITO (localStorage)
// -------------------------
function agregarAlCarrito(producto) {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    carrito.push({
        id: producto._id,
        nombre: producto.nombre,
        precio: producto.precio,
        cantidad: 1
    });

    localStorage.setItem("carrito", JSON.stringify(carrito));

    alert("Producto añadido al carrito");
}
