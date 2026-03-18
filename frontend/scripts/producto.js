const params = new URLSearchParams(window.location.search);
const id = params.get("id");

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

async function cargarProducto() {
    try {
        const res = await fetch(`http://localhost:3000/api/productos/${id}`);
        const producto = await res.json();

        if (!producto) {
            nombreEl.textContent = "Producto no encontrado";
            return;
        }

        // IMAGEN PRINCIPAL
        if (producto.imagenes && producto.imagenes.length > 0) {
            imgPrincipal.src = "../" + producto.imagenes[0].replace("frontend/", "");
        }

        // NOMBRE
        nombreEl.textContent = producto.nombre;

        // PRECIOS
        precioActualEl.textContent = producto.precio + " €";
        precioAnteriorEl.textContent = (producto.precio * 1.10).toFixed(2) + " €";
        descuentoEl.textContent = "-10%";

        // RATING
        ratingEl.textContent = "4.8";

        // STOCK
        stockEl.textContent = `Stock disponible: ${producto.stock} unidades`;

        // ESPECIFICACIONES
        especificacionesEl.innerHTML = "";
        if (producto.descripcion) {
            const li = document.createElement("li");
            li.textContent = producto.descripcion;
            especificacionesEl.appendChild(li);
        }

        // CARGAR GRÁFICA
        cargarGrafica(producto.identification);

        contenedorMiniaturas.innerHTML = "";
        producto.imagenes.forEach((img, index) => {
            const mini = document.createElement("img");
            mini.src = "../" + img.replace("frontend/", "");
            mini.classList.add("miniatura");

            if (index === 0) imgPrincipal.src = mini.src;

            mini.addEventListener("click", () => {
                imgPrincipal.src = mini.src;
            });

            contenedorMiniaturas.appendChild(mini);
        });

        btnCarrito.addEventListener("click", () => agregarAlCarrito(producto));

    } catch (error) {
        console.error("Error cargando producto:", error);
    }
}

cargarProducto();

// ===============================
// 4. GRÁFICA DE PRECIOS
// ===============================
async function cargarGrafica(identification) {
    const res = await fetch("../data/precios.json"); // ← RUTA CORRECTA
    const data = await res.json();

    const producto = data.productos.find(p => p.identification === identification);

    if (!producto) {
        document.getElementById("contenedor-grafica").innerHTML =
            "<p>No hay datos de precio para este producto.</p>";
        return;
    }

    generarGraficaIndividual(producto.precios);

    const min = Math.min(...producto.precios);
    const max = Math.max(...producto.precios);
    const media = (producto.precios.reduce((a, b) => a + b) / producto.precios.length).toFixed(2);

    precioMinEl.textContent = min + " €";
    precioMaxEl.textContent = max + " €";
    precioMediaEl.textContent = media + " €";
}


function generarGraficaIndividual(precios) {
    const ctx = document.createElement("canvas");
    const contenedor = document.getElementById("contenedor-grafica");

    contenedor.innerHTML = "";
    contenedor.appendChild(ctx);

    new Chart(ctx, {
        type: "line",
        data: {
            labels: ["Semana 1", "Semana 2", "Semana 3", "Semana 4"],
            datasets: [{
                label: "Precio (€)",
                data: precios,
                borderColor: "#191970",
                backgroundColor: "rgba(25, 25, 112, 0.2)",
                borderWidth: 3,
                tension: 0.3
            }]
        }
    });
}

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