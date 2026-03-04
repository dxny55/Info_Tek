// ===============================
// 1. OBTENER ID DE LA URL
// ===============================
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

// ===============================
// 2. REFERENCIAS DEL DOM
// ===============================
const imgPrincipal = document.getElementById("producto-imagen");
const nombreEl = document.getElementById("producto-nombre");
const precioActualEl = document.getElementById("producto-precio-actual");
const precioAnteriorEl = document.getElementById("producto-precio-anterior");
const descuentoEl = document.getElementById("producto-descuento");
const ratingEl = document.getElementById("producto-rating");
const stockEl = document.getElementById("producto-stock");
const especificacionesEl = document.getElementById("producto-especificaciones");
const btnCarrito = document.getElementById("btn-carrito");

// Contenedor para miniaturas (si quieres añadirlo después)
const contenedorImagenes = document.querySelector(".producto-imagen");

// ===============================
// 3. CARGAR PRODUCTO DESDE BACKEND
// ===============================
async function cargarProducto() {
    try {
        const res = await fetch(`http://localhost:3000/api/productos/${id}`);
        const producto = await res.json();

        if (!producto) {
            nombreEl.textContent = "Producto no encontrado";
            return;
        }

        // ===============================
        // IMAGEN PRINCIPAL
        // ===============================
        if (producto.imagenes && producto.imagenes.length > 0) {
            const ruta = "../" + producto.imagenes[0].replace("frontend/", "");
            imgPrincipal.src = ruta;
        } else {
            imgPrincipal.src = "../recursos/imagenes/default.jpg";
        }

        // ===============================
        // NOMBRE
        // ===============================
        nombreEl.textContent = producto.nombre;

        // ===============================
        // PRECIOS
        // ===============================
        precioActualEl.textContent = producto.precio + " €";
        precioAnteriorEl.textContent = (producto.precio * 1.10).toFixed(2) + " €";
        descuentoEl.textContent = "-10%";

        // ===============================
        // RATING (simulado)
        // ===============================
        ratingEl.textContent = "4.8";

        // ===============================
        // STOCK
        // ===============================
        stockEl.textContent = `Stock disponible: ${producto.stock} unidades`;

        // ===============================
        // ESPECIFICACIONES
        // ===============================
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

        // ===============================
        // MINIATURAS (si hay más imágenes)
        // ===============================
        if (producto.imagenes && producto.imagenes.length > 1) {
            producto.imagenes.forEach((img, index) => {
                if (index === 0) return; // ya es la principal

                const mini = document.createElement("img");
                mini.src = "../" + img.replace("frontend/", "");
                mini.classList.add("miniatura");

                mini.addEventListener("click", () => {
                    imgPrincipal.src = mini.src;
                });

                contenedorImagenes.appendChild(mini);
            });
        }

        // ===============================
        // BOTÓN AÑADIR AL CARRITO
        // ===============================
        btnCarrito.addEventListener("click", () => agregarAlCarrito(producto));

    } catch (error) {
        console.error("Error cargando producto:", error);
    }
}

cargarProducto();

// ===============================
// 4. CARRITO (localStorage)
// ===============================
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
