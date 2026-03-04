import { createProductCard } from "../src/components/productCard/productCard.js";
import { initCompareModal } from "../src/components/compareModal/compareModal.js";

// ===============================
// Referencias del DOM
// ===============================
const contenedor = document.getElementById("lista-productos");
const contador = document.getElementById("contador-productos");
const botonesCategorias = document.querySelectorAll(".categoria-btn");
const btnCompararFinal = document.getElementById("btn-comparar-final");

// Inicializar modal de comparativa
const compareModal = initCompareModal();

// ===============================
// Variables globales
// ===============================
let productos = [];
let seleccionados = []; // Para el comparador

// Mapa entre botones y categorías de MongoDB
const mapaCategorias = {
    CPU: "Procesador",
    GPU: "Tarjeta Gráfica",
    RAM: "RAM",
    Motherboard: "Placa Base",
    Storage: "Almacenamiento",
    PSU: "PSU"
};

// ===============================
// Cargar productos desde el backend
// ===============================
fetch("http://localhost:3000/api/productos")
    .then(res => res.json())
    .then(data => {
        productos = data;
        mostrarProductos(productos);
    })
    .catch(err => console.error("Error cargando productos:", err));


// ===============================
// Mostrar productos en pantalla
// ===============================
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

    if (contador) {
        contador.textContent = `${lista.length} productos`;
    }
}


// ===============================
// Filtro por categorías
// ===============================
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


// ===============================
// Botón "Comparar" en cada tarjeta
// ===============================
function toggleComparar(id, boton) {
    const producto = productos.find(p => p._id === id);

    // Si no hay seleccionados, se permite cualquiera
    if (seleccionados.length === 0) {
        seleccionados.push(producto);
        boton.classList.add("seleccionado");
        return;
    }

    // Si ya hay seleccionados, deben ser de la misma categoría
    if (producto.categoria !== seleccionados[0].categoria) {
        alert("Solo puedes comparar productos de la misma categoría");
        return;
    }

    // Si ya estaba seleccionado → quitarlo
    const index = seleccionados.findIndex(p => p._id === id);
    if (index !== -1) {
        seleccionados.splice(index, 1);
        boton.classList.remove("seleccionado");
        return;
    }

    // Si no estaba → añadirlo
    seleccionados.push(producto);
    boton.classList.add("seleccionado");
}


// ===============================
// Botón global "Comparar seleccionados"
// ===============================
btnCompararFinal.addEventListener("click", () => {
    if (seleccionados.length < 2) {
        alert("Selecciona al menos 2 productos para comparar.");
        return;
    }

    compareModal.abrir(seleccionados);
});


// ===============================
// Funciones placeholder (si aún no existen)
// ===============================
function verDetalle(producto) {
    console.log("Ver detalle:", producto);
}

function añadirCarrito(producto) {
    console.log("Añadir al carrito:", producto);
}
