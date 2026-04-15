import { createProductCard } from "../src/components/productCard/productCard.js";
import { initCompareModal } from "../src/components/compareModal/compareModal.js";

const contenedor = document.getElementById("lista-productos");
const contador = document.getElementById("contador-productos");
const btnCompararFinal = document.getElementById("btn-comparar-final");
const btnCuenta = document.getElementById("btn-cuenta");

const compareModal = initCompareModal();

let seleccionados = [];

// ===============================
// CARGAR FAVORITOS
// ===============================
function cargarFavoritos() {
    const favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

    contenedor.innerHTML = "";

    if (favoritos.length === 0) {
        contenedor.innerHTML = "<p style='margin:40px'>No tienes favoritos aún</p>";
        contador.textContent = "0 productos";
        return;
    }

    favoritos.forEach(p => {
        const card = createProductCard(
            p,
            verDetalle,
            toggleFavorito,
            toggleComparar
        );

        contenedor.appendChild(card);
    });

    contador.textContent = `${favoritos.length} productos`;
}

cargarFavoritos();


// ===============================
// FUNCIONES
// ===============================

// Ir al producto
function verDetalle(producto) {
    window.location.href = `producto.html?id=${producto._id}`;
}

// Favoritos (igual que index)
function toggleFavorito(producto, boton) {
    let favs = JSON.parse(localStorage.getItem("favoritos")) || [];

    const index = favs.findIndex(p => p._id === producto._id);

    if (index === -1) {
        favs.push(producto);
        boton.classList.add("favorito-activo");
    } else {
        favs.splice(index, 1);
        boton.classList.remove("favorito-activo");

        // 🔥 recargar vista
        cargarFavoritos();
    }

    localStorage.setItem("favoritos", JSON.stringify(favs));
}

// Comparador (igual que index)
function toggleComparar(id, boton) {
    const favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
    const producto = favoritos.find(p => p._id === id);

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

// BOTÓN COMPARAR FINAL
if (btnCompararFinal) {
    btnCompararFinal.addEventListener("click", () => {
        if (seleccionados.length < 2) {
            alert("Selecciona al menos 2 productos");
            return;
        }

        compareModal.abrir(seleccionados);
    });
}

// BOTÓN CUENTA
if (btnCuenta) {
    btnCuenta.addEventListener("click", () => {
        window.location.href = "account.html";
    });
}