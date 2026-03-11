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

        if (producto.imagenes && producto.imagenes.length > 0) {
            imgPrincipal.src = "../" + producto.imagenes[0].replace("frontend/", "");
        }

        nombreEl.textContent = producto.nombre;
        precioActualEl.textContent = producto.precio + " €";
        precioAnteriorEl.textContent = (producto.precio * 1.10).toFixed(2) + " €";
        descuentoEl.textContent = "-10%";
        ratingEl.textContent = "4.8";
        stockEl.textContent = `Stock disponible: ${producto.stock} unidades`;

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
