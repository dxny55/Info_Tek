export function aplicarFiltros(productos) {
    // Texto del buscador
    const texto = document.getElementById("filtro-texto").value.toLowerCase().trim();

    // Precio
    const precioMin = parseFloat(document.getElementById("precio-min").value) || 0;
    const precioMax = parseFloat(document.getElementById("precio-max").value) || Infinity;

    // Categorías (las que ya tienes en tu HTML)
    const categoriasSeleccionadas = [...document.querySelectorAll(".filtro-categoria:checked")]
        .map(c => c.value.toLowerCase());

    // Marcas (las que ya tienes en tu HTML)
    const marcasSeleccionadas = [...document.querySelectorAll(".filtro-marca:checked")]
        .map(m => m.value.toLowerCase());

    return productos.filter(p => {

        // ============================
        // 1. FILTRO DE TEXTO INTELIGENTE
        // ============================
        const camposTexto = [
            p.nombreCorto,
            p.nombreLargo,
            p.descripcionCorta,
            ...(p.descripcionLarga || []),
            p.categoria,
            p.marca,
            p.slug,
            p.identificacion
        ]
        .filter(Boolean) // elimina null/undefined
        .map(t => t.toLowerCase());

        const coincideTexto =
            texto === "" ||
            camposTexto.some(campo => campo.includes(texto));

        // ============================
        // 2. FILTRO DE PRECIO
        // ============================
        const coincidePrecio =
            p.precio >= precioMin && p.precio <= precioMax;

        // ============================
        // 3. FILTRO DE CATEGORÍA
        // ============================
        const coincideCategoria =
            categoriasSeleccionadas.length === 0 ||
            categoriasSeleccionadas.includes(p.categoria.toLowerCase());

        // ============================
        // 4. FILTRO DE MARCA
        // ============================
        const coincideMarca =
            marcasSeleccionadas.length === 0 ||
            marcasSeleccionadas.includes(p.marca?.toLowerCase());

        return coincideTexto && coincidePrecio && coincideCategoria && coincideMarca;
    });
}
