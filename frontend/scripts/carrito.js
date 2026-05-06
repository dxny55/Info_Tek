// ===============================
// CARRITO - PÁGINA CARRITO.HTML
// ===============================
const tbody = document.getElementById("lista-carrito");
const totalEl = document.getElementById("total-carrito");
const btnComprar = document.getElementById("btn-comprar");

function cargarCarrito() {
    return JSON.parse(localStorage.getItem("carrito")) || [];
}

function guardarCarrito(carrito) {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

function calcularTotal(carrito) {
    
    return carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
}

function renderCarrito() {
    const carrito = cargarCarrito();
    
    tbody.innerHTML = "";

    if (carrito.length === 0) {
    tbody.innerHTML = `
        <tr>
            <td colspan="5">
                <div class="carrito-vacio">
                    <h3>🛒 Tu carrito está vacío</h3>
                    <p>Parece que aún no has añadido ningún producto.</p>
                    <a href="index.html" class="btn-seguir">Seguir comprando</a>
                </div>
            </td>
        </tr>
    `;

    totalEl.textContent = "0 €";

    // 🔴 DESACTIVAR BOTÓN FINALIZAR COMPRA
    btnComprar.disabled = true;
    btnComprar.classList.add("btn-disabled");

    return;
}


    console.log("items carrito: " + carrito.length);
    carrito.forEach((item, index) => {
        
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>
                <div style="display:flex; align-items:center; gap:10px;">
                    ${item.imagen ? `<img src="../${item.imagen}" style="width:50px; height:50px; object-fit:contain;">` : ""}
                    <span>${item.nombre}</span>
                </div>
            </td>
            <td>${item.precio.toFixed(2)} €</td>
            <td>
                <input type="number" min="1" value="${item.cantidad}" data-index="${index}" class="input-cantidad">
            </td>
            <td>${(item.precio * item.cantidad).toFixed(2)} €</td>
            <td>
                <button class="btn-eliminar" data-index="${index}">🗑</button>
            </td>
        `;

        tbody.appendChild(tr);
    });
    
    totalEl.textContent = calcularTotal(carrito).toFixed(2) + " €";
    // 🟢 ACTIVAR BOTÓN FINALIZAR COMPRA
    btnComprar.disabled = false;
    btnComprar.classList.remove("btn-disabled");


    // Eventos cantidad
    document.querySelectorAll(".input-cantidad").forEach(input => {
        input.addEventListener("change", (e) => {
            const idx = e.target.dataset.index;
            let carrito = cargarCarrito();
            const nueva = parseInt(e.target.value) || 1;
            carrito[idx].cantidad = nueva < 1 ? 1 : nueva;
            guardarCarrito(carrito);
            renderCarrito();
        });
    });

    // Eventos eliminar
    document.querySelectorAll(".btn-eliminar").forEach(btn => {
        console.log("asdf");
        btn.addEventListener("click", (e) => {
            const idx = e.target.dataset.index;
            let carrito = cargarCarrito();
            carrito.splice(idx, 1);
            guardarCarrito(carrito);
            renderCarrito();
        });
    });
}

btnComprar.addEventListener("click", () => {
    window.location.href = "./checkout.html";
});


renderCarrito();
