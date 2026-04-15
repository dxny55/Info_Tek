// ===============================
// 1. OBTENER ID Y REFERENCIAS
// ===============================
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

const imgPrincipal = document.getElementById("producto-imagen");
const contenedorMiniaturas = document.getElementById("miniaturas");
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
// 2. CARGAR PRODUCTO (FETCH API)
// ===============================
async function cargarProducto() {
    // Evitar ejecución si no hay ID o no estamos en la página correcta
    if (!id || !nombreEl) return;

    try {
        const res = await fetch(`http://localhost:3000/api/productos/${id}`);
        const producto = await res.json();

        if (!producto) {
            nombreEl.textContent = "Producto no encontrado";
            return;
        }

        // --- IMÁGENES Y MINIATURAS ---
        if (producto.imagenes && producto.imagenes.length > 0) {
            // Limpiar "frontend/" de la ruta si existe (del primer código)
            const procesarRuta = (ruta) => "../" + ruta.replace("frontend/", "");
            
            imgPrincipal.src = procesarRuta(producto.imagenes[0]);

            // Generar miniaturas dinámicas (del segundo código)
            if (contenedorMiniaturas) {
                contenedorMiniaturas.innerHTML = "";
                producto.imagenes.forEach((img) => {
                    const mini = document.createElement("img");
                    mini.src = procesarRuta(img);
                    mini.classList.add("miniatura");
                    
                    mini.addEventListener("click", () => {
                        imgPrincipal.src = mini.src;
                        // Opcional: marcar activa
                        document.querySelectorAll('.miniatura').forEach(m => m.classList.remove('activa'));
                        mini.classList.add('activa');
                    });
                    contenedorMiniaturas.appendChild(mini);
                });
            }
        }

        // --- DATOS BÁSICOS ---
        nombreEl.textContent = producto.nombreLargo || producto.nombre || "Sin nombre";
        precioActualEl.textContent = `${producto.precio} €`;
        
        // Cálculo de descuento dinámico
        if (producto.precioAnterior) {
            precioAnteriorEl.textContent = `${producto.precioAnterior} €`;
            const ahorro = Math.round((1 - producto.precio / producto.precioAnterior) * 100);
            descuentoEl.textContent = `-${ahorro}%`;
        } else {
            // Backup si no hay precio anterior (estimación 10%)
            precioAnteriorEl.textContent = (producto.precio * 1.10).toFixed(2) + " €";
            descuentoEl.textContent = "-10%";
        }

        ratingEl.textContent = producto.rating || "4.8";
        stockEl.textContent = `Stock disponible: ${producto.stock} unidades`;

        // --- ESPECIFICACIONES DINÁMICAS ---
        especificacionesEl.innerHTML = "";
        if (producto.especificaciones && typeof producto.especificaciones === 'object') {
            // Si es un objeto (Clave: Valor)
            Object.entries(producto.especificaciones).forEach(([clave, valor]) => {
                const li = document.createElement("li");
                li.innerHTML = `<strong>${clave}:</strong> ${valor}`;
                especificacionesEl.appendChild(li);
            });
        } else if (producto.descripcion) {
            // Si solo hay descripción (Fallback)
            const li = document.createElement("li");
            li.textContent = producto.descripcion;
            especificacionesEl.appendChild(li);
        }

        // --- GRÁFICA Y ESTADÍSTICAS ---
        if (producto.historialPrecios && producto.historialPrecios.length > 0) {
            generarGraficaIndividual(producto.historialPrecios);
            actualizarEstadisticas(producto.historialPrecios.map(h => h.precio));
        } else {
            // Fallback: Intentar cargar de precios.json si no hay historial en BD
            cargarGraficaDesdeJSON(producto.identification);
        }

        // --- EVENTOS DE BOTONES ---
        btnCarrito?.addEventListener("click", () => agregarAlCarrito(producto));

    } catch (error) {
        console.error("Error cargando producto:", error);
    }
}

// ===============================
// 3. FUNCIONES DE GRÁFICA
// ===============================
function generarGraficaIndividual(historial) {
    const contenedor = document.getElementById("contenedor-grafica");
    if (!contenedor) return;

    const ctx = document.createElement("canvas");
    contenedor.innerHTML = "";
    contenedor.appendChild(ctx);

    // Adaptar etiquetas: si es historial de BD usa fechas, si es array simple usa semanas
    const labels = historial[0]?.fecha ? historial.map(h => h.fecha) : ["Sem. 1", "Sem. 2", "Sem. 3", "Sem. 4"];
    const dataPoints = historial[0]?.precio !== undefined ? historial.map(h => h.precio) : historial;

    new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [{
                label: "Precio (€)",
                data: dataPoints,
                borderColor: "#191970",
                backgroundColor: "rgba(25, 25, 112, 0.2)",
                borderWidth: 3,
                tension: 0.3
            }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
}

function actualizarEstadisticas(precios) {
    const validos = precios.filter(p => p !== null && !isNaN(p));
    if (validos.length === 0) return;

    const min = Math.min(...validos);
    const max = Math.max(...validos);
    const media = (validos.reduce((a, b) => a + b) / validos.length).toFixed(2);

    if (precioMinEl) precioMinEl.textContent = `${min} €`;
    if (precioMaxEl) precioMaxEl.textContent = `${max} €`;
    if (precioMediaEl) precioMediaEl.textContent = `${media} €`;
}

async function cargarGraficaDesdeJSON(identification) {
    try {
        const res = await fetch("../data/precios.json");
        const data = await res.json();
        const pData = data.productos.find(p => p.identification === identification);
        
        if (pData) {
            generarGraficaIndividual(pData.precios);
            actualizarEstadisticas(pData.precios);
        }
    } catch (e) { console.error("Error cargando JSON de respaldo", e); }
}

// ===============================
// 4. CARRITO Y FAVORITOS
// ===============================
function agregarAlCarrito(producto) {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    
    carrito.push({
        id: producto._id,
        nombre: producto.nombreCorto || producto.nombre,
        precio: producto.precio,
        imagen: producto.imagenes?.[0] || "",
        cantidad: 1
    });

    localStorage.setItem("carrito", JSON.stringify(carrito));
    alert("🛒 Producto añadido al carrito");
}

function toggleFavorito(producto) {
    let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

    const index = favoritos.findIndex(p => p._id === producto._id);

    if (index !== -1) {
        favoritos.splice(index, 1);
        alert("❌ Eliminado de favoritos");
    } else {
        favoritos.push({
            _id: producto._id,
            nombre: producto.nombreLargo || producto.nombre,
            precio: producto.precio,
            imagen: producto.imagenes?.[0] || ""
        });

        alert("❤️ Añadido a favoritos");
    }

    localStorage.setItem("favoritos", JSON.stringify(favoritos));
}

// Iniciar carga
cargarProducto();