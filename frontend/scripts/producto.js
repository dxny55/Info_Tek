const params = new URLSearchParams(window.location.search);
const id = params.get("id");

// ===============================
// GENERAR ESTRELLAS
// ===============================
function generarEstrellas(rating) {
    if (!rating || rating <= 0) return "☆☆☆☆☆";

    const llenas = Math.floor(rating);
    const vacias = 5 - llenas;

    return "★".repeat(llenas) + "☆".repeat(vacias);
}

// ELEMENTOS DEL DOM
const imgPrincipal = document.getElementById("producto-imagen");
const nombreEl = document.getElementById("producto-nombre");
const precioActualEl = document.getElementById("producto-precio-actual");
const precioAnteriorEl = document.getElementById("producto-precio-anterior");
const descuentoEl = document.getElementById("producto-descuento");
const ratingEl = document.getElementById("producto-rating");
const stockEl = document.getElementById("producto-stock");
const especificacionesEl = document.getElementById("producto-especificaciones");
const btnCarrito = document.getElementById("btn-carrito");
const contenedorMiniaturas = document.getElementById("miniaturas");

const precioMinEl = document.getElementById("precio-min");
const precioMaxEl = document.getElementById("precio-max");
const precioMediaEl = document.getElementById("precio-media");

// ===============================
// CARGAR PRODUCTO
// ===============================
async function cargarProducto() {
    try {
        const res = await fetch(`http://localhost:3000/api/productos/${id}`);
        const producto = await res.json();

        if (!producto) {
            nombreEl.textContent = "Producto no encontrado";
            return;
        }

        // IMAGEN PRINCIPAL
        if (producto.imagenes?.length > 0) {
            imgPrincipal.src = "../" + producto.imagenes[0];
        }

        // NOMBRE
        nombreEl.textContent = producto.nombreLargo || producto.nombreCorto;

        // PRECIOS
        precioActualEl.textContent = producto.precio + " €";
        precioAnteriorEl.textContent = producto.precioAnterior + " €";

        const descuento = Math.round(
            (1 - producto.precio / producto.precioAnterior) * 100
        );

        descuentoEl.textContent = `-${descuento}%`;

        // ⭐ RATING REAL DESDE MONGODB
        ratingEl.innerHTML = `
            <span class="stars">${generarEstrellas(producto.rating)}</span>
            <span class="rating-number">${producto.rating ? producto.rating.toFixed(1) : "N/A"} / 5</span>
        `;


        // STOCK
        stockEl.textContent = `Stock disponible: ${producto.stock} unidades`;

        // ESPECIFICACIONES
        especificacionesEl.innerHTML = "";
        Object.entries(producto.especificaciones).forEach(([clave, valor]) => {
            const li = document.createElement("li");
            li.textContent = `${clave}: ${valor}`;
            especificacionesEl.appendChild(li);
        });

        // MINIATURAS
        contenedorMiniaturas.innerHTML = "";
        producto.imagenes.forEach((img, index) => {
            const mini = document.createElement("img");
            mini.src = "../" + img;
            mini.classList.add("miniatura");

            if (index === 0) imgPrincipal.src = mini.src;

            mini.addEventListener("click", () => {
                imgPrincipal.src = mini.src;
            });

            contenedorMiniaturas.appendChild(mini);
        });

        // CARGAR GRÁFICA INDIVIDUAL
        generarGraficaIndividual(producto.historialPrecios);

        // ESTADÍSTICAS
        const precios = producto.historialPrecios
            .map(h => h.precio)
            .filter(p => p !== null);

        precioMinEl.textContent = Math.min(...precios) + " €";
        precioMaxEl.textContent = Math.max(...precios) + " €";
        precioMediaEl.textContent =
            (precios.reduce((a, b) => a + b) / precios.length).toFixed(2) + " €";

        // BOTÓN CARRITO
        btnCarrito.addEventListener("click", () => agregarAlCarrito(producto));

    } catch (error) {
        console.error("Error cargando producto:", error);
    }
}

cargarProducto();

// ===============================
// GRÁFICA INDIVIDUAL
// ===============================
function generarGraficaIndividual(historial) {
    const ctx = document.createElement("canvas");
    const contenedor = document.getElementById("contenedor-grafica");

    contenedor.innerHTML = "";
    contenedor.appendChild(ctx);

    new Chart(ctx, {
        type: "line",
        data: {
            labels: historial.map(h => h.fecha),
            datasets: [{
                label: "Precio (€)",
                data: historial.map(h => h.precio),
                borderColor: "#191970",
                backgroundColor: "rgba(25, 25, 112, 0.2)",
                borderWidth: 3,
                tension: 0.3
            }]
        }
    });
}

// ===============================
// ANIMACION CARRITO
// ===============================
function animarProductoAlCarrito(imagenSrc, origenX, origenY) {
    const carritoIcon = document.getElementById("btn-carrito-nav");

    if (!carritoIcon) return;

    const destino = carritoIcon.getBoundingClientRect();

    const img = document.createElement("img");
    img.src = imagenSrc;
    img.classList.add("fly-img");

    img.style.left = origenX + "px";
    img.style.top = origenY + "px";

    document.body.appendChild(img);

    setTimeout(() => {
        img.style.transform = `translate(${destino.left - origenX}px, ${destino.top - origenY}px) scale(0.2)`;
        img.style.opacity = "0";
    }, 50);

    setTimeout(() => img.remove(), 900);
}

// ===============================
// TROAST
// ===============================
function mostrarToast(mensaje) {
    const toast = document.getElementById("toast");
    toast.innerHTML = mensaje;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}


// ===============================
// CARRITO
// ===============================
function actualizarContadorCarrito() {
    const span = document.getElementById("carrito-count");
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const totalUnidades = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    if (span) span.textContent = totalUnidades;
}

function agregarAlCarrito(producto) {
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

    // ⭐ ANIMACIÓN DEL PRODUCTO VOLANDO AL CARRITO
    const rect = imgPrincipal.getBoundingClientRect();
    animarProductoAlCarrito(
        "../" + (producto.imagenes?.[0] || "recursos/imagenes/placeholder.png"),
        rect.left,
        rect.top
    );

    // ⭐ EFECTO VISUAL DEL BOTÓN
    btnCarrito.classList.add("btn-agregado");
    setTimeout(() => btnCarrito.classList.remove("btn-agregado"), 800);

    // ⭐ NOTIFICACIÓN TOAST
    mostrarToast(`
        ✔ Producto añadido al carrito<br>
        <a href="carrito.html" style="color:#ffd700; text-decoration:underline;">Ir al carrito</a>
    `);
}



// NAVBAR: botón carrito
const btnCarritoNav = document.getElementById("btn-carrito-nav");
if (btnCarritoNav) {
    btnCarritoNav.addEventListener("click", () => {
        window.location.href = "./carrito.html";
    });
}

// Inicializar contador al cargar
actualizarContadorCarrito();

