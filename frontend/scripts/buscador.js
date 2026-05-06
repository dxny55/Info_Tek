// ===============================
// BUSCADOR PRINCIPAL (FILTRA LISTA EN TIEMPO REAL)
// ===============================

document.addEventListener("DOMContentLoaded", () => {

    const inputBuscador = document.getElementById("filtro-texto");

    // Si no existe el input, no hacemos nada
    if (!inputBuscador) return;

    // Esperar a que cargarProductos.js cargue los productos
    const esperar = setInterval(() => {
        if (window.productosOriginales && Array.isArray(window.productosOriginales)) {
            clearInterval(esperar);

            inputBuscador.addEventListener("input", () => {

                const texto = inputBuscador.value.trim().toLowerCase();

                // 1) Aplicar filtros normales (categoría, marca, precio)
                let lista = aplicarFiltros(window.productosOriginales);

                // 2) Filtrar por texto SOLO por nombreLargo
                if (texto.length > 0) {
                    lista = lista.filter(p =>
                        (p.nombreLargo || "").toLowerCase().includes(texto)
                    );
                }

                // 3) Renderizar lista final
                renderizarProductos(lista);
            });
        }
    }, 100);
});
