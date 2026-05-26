const params = new URLSearchParams(window.location.search);
const id = params.get("id");

const imgPrincipal = document.getElementById("producto-imagen");
const btnCarrito = document.getElementById("btn-carrito");
const nombreEl = document.getElementById("producto-nombre");
const precioActualEl = document.getElementById("producto-precio-actual");
const specificationsEl = document.getElementById("producto-especificaciones");
const ratingEl = document.getElementById("producto-rating"); // Elemento de estrellas

// Función de estrellas
function generarEstrellas(rating) {
    if (!rating || rating <= 0) return "☆☆☆☆☆";
    const llenas = Math.floor(rating);
    const vacias = 5 - llenas;
    return "★".repeat(llenas) + "☆".repeat(vacias);
}

window.actualizarContadorCarritoGlobal = function() {
    const span = document.getElementById("carrito-count");
    if (!span) return;
    
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    
    // CORRECCIÓN: Sumamos la propiedad 'cantidad' de cada item
    const totalUnidades = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    
    span.textContent = totalUnidades;
    span.style.display = totalUnidades > 0 ? "flex" : "none";
};

async function cargarProducto() {
    try {
        const res = await fetch(`http://localhost:3000/api/productos/${id}`);
        const producto = await res.json();
        if (!producto) return;

        imgPrincipal.src = "../" + producto.imagenes[0];
        nombreEl.textContent = producto.nombreLargo || producto.nombreCorto;
        precioActualEl.textContent = producto.precio + " €";

        // RESTAURACIÓN ESTRELLAS
        ratingEl.innerHTML = `
            <span class="stars">${generarEstrellas(producto.rating)}</span>
            <span class="rating-number">${producto.rating ? producto.rating.toFixed(1) : "0.0"} / 5</span>
        `;

        specificationsEl.innerHTML = "";
        Object.entries(producto.especificaciones).forEach(([k, v]) => {
            const li = document.createElement("li");
            li.textContent = `${k}: ${v}`;
            specificationsEl.appendChild(li);
        });

        generarGraficaIndividual(producto.historialPrecios);
        btnCarrito.onclick = () => agregarAlCarrito(producto);
    } catch (e) { console.error("Error:", e); }
}

function generarGraficaIndividual(historial) {
    const contenedor = document.getElementById("contenedor-grafica");
    if (!contenedor) return;
    contenedor.innerHTML = '<canvas id="graficaCanvas"></canvas>';
    const ctx = document.getElementById("graficaCanvas");
    new Chart(ctx, {
        type: "line",
        data: {
            labels: historial.map(h => h.fecha),
            datasets: [{ label: "Precio (€)", data: historial.map(h => h.precio), borderColor: "#191970", tension: 0.3 }]
        }
    });
}

function agregarAlCarrito(producto) {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    
    // IMPORTANTE: Aseguramos que comparamos tipos iguales (convertimos a string ambos IDs)
    const idProducto = String(producto._id);
    const item = carrito.find(i => String(i.id) === idProducto);
    
    if (item) {
        // Si existe, sumamos 1 a la cantidad existente
        item.cantidad += 1;
    } else {
        // Si NO existe, creamos el nuevo objeto
        carrito.push({ 
            id: idProducto, 
            nombre: producto.nombreCorto, 
            precio: parseFloat(producto.precio), 
            cantidad: 1, 
            imagen: producto.imagenes[0] 
        });
    }
    
    localStorage.setItem("carrito", JSON.stringify(carrito));

    // Animación
    if (imgPrincipal && typeof animarProductoAlCarrito === 'function') {
        const rect = imgPrincipal.getBoundingClientRect();
        animarProductoAlCarrito(imgPrincipal.src, rect.left, rect.top);
    }

    actualizarContadorCarritoGlobal();
    if (typeof mostrarToast === 'function') {
        mostrarToast("Producto añadido al carrito");
    }
}

// ... (mantén tus funciones animarProductoAlCarrito y mostrarToast originales)

window.addEventListener('load', actualizarContadorCarritoGlobal);
if (id) cargarProducto();