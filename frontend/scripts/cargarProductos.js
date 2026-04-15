import { createProductCard } from "../src/components/productCard/productCard.js";
import { initCompareModal } from "../src/components/compareModal/compareModal.js";

const contenedor = document.getElementById("lista-productos");
const contador = document.getElementById("contador-productos");
const botonesCategorias = document.querySelectorAll(".categoria-btn");
const btnCompararFinal = document.getElementById("btn-comparar-final");
const btnCuenta = document.getElementById("btn-cuenta");
const selectorColor = document.getElementById("selector-color");

const compareModal = initCompareModal();

let productos = [];
let seleccionados = [];

const mapaCategorias = {
    CPU: "Procesador",
    GPU: "Tarjeta Gráfica",
    RAM: "RAM",
    Motherboard: "Placa Base",
    Storage: "Almacenamiento",
    PSU: "PSU"
};

// ===============================
// CARGAR PRODUCTOS
// ===============================
fetch("http://localhost:3000/api/productos")
    .then(res => res.json())
    .then(data => {
        productos = data;
        mostrarProductos(productos);
    });

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
// FAVORITOS
// ===============================
function toggleFavorito(producto, boton) {

    let favs = JSON.parse(localStorage.getItem("favoritos")) || [];

    const index = favs.findIndex(p => p._id === producto._id);

    if (index === -1) {

        const productoGuardado = {
            _id: producto._id,
            nombre: producto.nombre,
            precio: producto.precio,
            imagen: producto.imagenes?.[0]
                ? "../" + producto.imagenes[0].replace("frontend/", "")
                : "../recursos/imagenes/default.jpg"
        };

        favs.push(productoGuardado);
        boton.classList.add("activo");

    } else {

        favs.splice(index, 1);
        boton.classList.remove("activo");

    }

    localStorage.setItem("favoritos", JSON.stringify(favs));
}

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
        alert("Selecciona al menos 2 productos");
        return;
    }

    compareModal.abrir(seleccionados);
});

// ===============================
// DETALLE PRODUCTO
// ===============================
function verDetalle(producto) {
    window.location.href = `producto.html?id=${producto._id}`;
}

// ===============================
// CUENTA
// ===============================
btnCuenta.addEventListener("click", () => {
    window.location.href = "./account.html";
});

// ===============================
// COLOR
// ===============================
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