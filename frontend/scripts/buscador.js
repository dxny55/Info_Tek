// ==========================================================================
// BUSCADOR HÍBRIDO (FILTRA BASE DE DATOS O ELEMENTOS VISUALES DEL DOM)
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
    const inputBuscador = document.querySelector(".buscador");

    if (!inputBuscador) return;

    // CASO 1: Estamos en index.html (Filtro por base de datos de tu compañero)
    const esperarYFiltrarBD = setInterval(() => {
        if (window.productosOriginales && Array.isArray(window.productosOriginales)) {
            clearInterval(esperarYFiltrarBD);

            inputBuscador.addEventListener("input", () => {
                const texto = inputBuscador.value.trim().toLowerCase();
                let lista = typeof aplicarFiltros === "function" ? aplicarFiltros(window.productosOriginales) : window.productosOriginales;

                if (texto.length > 0) {
                    lista = lista.filter(p => {
                        const nombreLargo = (p.nombreLargo || "").toLowerCase();
                        const nombre = (p.nombre || "").toLowerCase();
                        const titulo = (p.titulo || "").toLowerCase();
                        return nombreLargo.includes(texto) || nombre.includes(texto) || titulo.includes(texto);
                    });
                }

                if (typeof renderizarProductos === "function") {
                    renderizarProductos(lista);
                }
            });
        }
    }, 100);

    // Cancelar el bucle si tras 1.5 segundos vemos que no es la tienda principal (evita consumo de memoria)
    setTimeout(() => clearInterval(esperarYFiltrarBD), 1500);

    // CASO 2: Estamos en favoritos, carrito o cuenta (Filtro visual directo sobre tarjetas o filas)
    inputBuscador.addEventListener("input", (e) => {
        // Si estamos en la página de inicio con la BD cargada, dejamos que actúe el código de arriba
        if (window.productosOriginales && Array.isArray(window.productosOriginales)) return;

        const texto = e.target.value.toLowerCase().trim();

        // Filtrar tarjetas de productos si las hay (.producto-card)
        const tarjetas = document.querySelectorAll(".producto-card");
        tarjetas.forEach(tarjeta => {
            const nombre = tarjeta.textContent.toLowerCase();
            tarjeta.style.display = nombre.includes(texto) ? "flex" : "none";
        });

        // Filtrar filas de tablas si estamos en la vista de carrito (filas de productos)
        const filasTabla = document.querySelectorAll(".tabla-carrito tbody tr");
        filasTabla.forEach(fila => {
            const nombreFila = fila.textContent.toLowerCase();
            fila.style.display = nombreFila.includes(texto) ? "" : "none";
        });
    });
});