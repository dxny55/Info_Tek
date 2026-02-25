import { createProductCard } from "../src/components/productCard/productCard.js";

const contenedor = document.getElementById("lista-productos");
const contador = document.getElementById("contador-productos");
const botonesCategorias = document.querySelectorAll(".categoria-btn");

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
        // Quitar clase activa a todos
        botonesCategorias.forEach(b => b.classList.remove("activo"));

        // Activar el botón pulsado
        btn.classList.add("activo");

        const catBoton = btn.dataset.cat; // ej: "CPU", "GPU", "Todos"

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
// Botón "Ver más" (aunque no lo uses ahora)
// ===============================
function verDetalle(id) {
    window.location.href = `producto.html?id=${id}`;
}

// ===============================
// Botón "Añadir al carrito" (aunque no lo uses)
// ===============================
function añadirCarrito(id) {
    alert("Producto añadido al carrito (luego lo haremos real)");
}

// ===============================
// Botón "Comparar"
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
