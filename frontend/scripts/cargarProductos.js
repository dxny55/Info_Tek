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

fetch("http://localhost:3000/api/productos")
    .then(res => res.json())
    .then(data => {
        productos = data;
        mostrarProductos(productos);
    })
    .catch(err => console.error("Error cargando productos:", err));

function mostrarProductos(lista) {
    contenedor.innerHTML = "";

    lista.forEach(p => {
        const card = createProductCard(
            p,
            verDetalle,
            añadirCarrito,
            toggleComparar
        );
        contenedor.appendChild(card);
    });

    contador.textContent = `${lista.length} productos`;
}

botonesCategorias.forEach(btn => {
    btn.addEventListener("click", () => {
        botonesCategorias.forEach(b => b.classList.remove("activo"));
        btn.classList.add("activo");

        const catBoton = btn.dataset.cat;

        if (catBoton === "Todos") {
            mostrarProductos(productos);
            return;
        }

        const categoriaMongo = mapaCategorias[catBoton];
        const filtrados = productos.filter(p => p.categoria === categoriaMongo);

        mostrarProductos(filtrados);
    });
});

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
        alert("Selecciona al menos 2 productos para comparar.");
        return;
    }

    compareModal.abrir(seleccionados);
});

function verDetalle(producto) {
    window.location.href = `producto.html?id=${producto._id}`;
}

function añadirCarrito(producto, boton) {
    let favs = JSON.parse(localStorage.getItem("favoritos")) || [];

    const index = favs.findIndex(p => p._id === producto._id);

    if (index === -1) {
        // No está → añadir
        favs.push(producto);
        boton.classList.add("favorito-activo"); // opcional
    } else {
        // Ya está → quitar
        favs.splice(index, 1);
        boton.classList.remove("favorito-activo"); // opcional
    }

    localStorage.setItem("favoritos", JSON.stringify(favs));
}



//CUENTA------------------


btnCuenta.addEventListener("click", () => {
    window.location.href = "./account.html"; 
});

// Cargar color guardado
const colorGuardado = localStorage.getItem("colorFondo");
if (colorGuardado) {
    document.documentElement.style.setProperty("--color-fondo", colorGuardado);
    selectorColor.value = colorGuardado;
}

// Cambiar color al seleccionar
selectorColor.addEventListener("input", (e) => {
    const nuevoColor = e.target.value;
    document.documentElement.style.setProperty("--color-fondo", nuevoColor);
    localStorage.setItem("colorFondo", nuevoColor);
});
