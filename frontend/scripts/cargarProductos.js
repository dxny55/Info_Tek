import { createProductCard } from "../src/components/productCard/productCard.js";

const contenedor = document.getElementById("lista-productos");
let productos = [];
let seleccionados = []; // Para el comparador

// Cargar productos desde el backend
fetch("http://localhost:3000/api/productos")
    .then(res => res.json())
    .then(data => {
        productos = data;
        mostrarProductos(productos);
    })
    .catch(err => console.error("Error cargando productos:", err));

// Mostrar productos en la tienda


function mostrarProductos(lista) {
    const contenedor = document.getElementById("lista-productos");
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
}


// Botón "Ver más"
function verDetalle(id) {
    window.location.href = `producto.html?id=${id}`;
}

// Botón "Añadir al carrito"
function añadirCarrito(id) {
    alert("Producto añadido al carrito (luego lo haremos real)");
}

// Botón "Comparar"
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
