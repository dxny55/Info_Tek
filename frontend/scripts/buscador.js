// ===============================
// BUSCADOR RÁPIDO CON SUGERENCIAS
// ===============================

document.addEventListener("DOMContentLoaded", () => {

    const inputBuscador = document.querySelector(".buscador");
    const contenedorSugerencias = document.querySelector(".buscador-sugerencias");

    if (!inputBuscador || !contenedorSugerencias) return;

    // Esperar a que cargarProductos.js cargue los productos
    const esperar = setInterval(() => {
        if (window.productos && Array.isArray(window.productos)) {
            clearInterval(esperar);

            inputBuscador.addEventListener("input", () => {
                const texto = inputBuscador.value.toLowerCase();

                if (texto.length === 0) {
                    contenedorSugerencias.style.display = "none";
                    return;
                }

                const filtrados = window.productos.filter(p =>
                    p.nombre.toLowerCase().includes(texto)
                );

                mostrarSugerencias(filtrados);
            });
        }
    }, 100);

    function mostrarSugerencias(lista) {
        contenedorSugerencias.innerHTML = "";

        if (lista.length === 0) {
            contenedorSugerencias.style.display = "none";
            return;
        }

        lista.slice(0, 8).forEach(p => {
            const item = document.createElement("div");
            item.classList.add("sugerencia-item");

            item.innerHTML = `
                <img src="${p.imagenes?.[0] || '../recursos/imagenes/placeholder.png'}">
                <div class="sugerencia-info">
                    <span>${p.nombre}</span>
                    <span class="sugerencia-precio">${p.precio} €</span>
                </div>
            `;

            item.addEventListener("click", () => {
                window.location.href = `producto.html?id=${p._id}`;
            });

            contenedorSugerencias.appendChild(item);
        });

        contenedorSugerencias.style.display = "flex";
    }

    // Ocultar sugerencias al hacer click fuera
    document.addEventListener("click", (e) => {
        if (!contenedorSugerencias.contains(e.target) &&
            e.target !== inputBuscador) {
            contenedorSugerencias.style.display = "none";
        }
    });
});
