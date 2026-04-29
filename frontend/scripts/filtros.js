// Filtrado robusto:
// - Categorías: usa p.categoria (campo DB) con mapeo para TV -> Electrodomésticos, Consolas, Placas Base.
// - Marcas: detectadas desde nombreLargo (solo las relevantes).
// - Precio: rango mínimo/máximo.
// No modifica el DOM.

const MARCAS_RELEVANTES = ["AMD","Intel","NVIDIA","Samsung","Xiaomi","Sony","Microsoft","Nintendo"];

// Normaliza texto: trim + lowercase + quitar diacríticos
function removeDiacritics(str) {
    return (str || "").normalize?.("NFD").replace(/\p{Diacritic}/gu, "") || (str || "");
}
function norm(text) {
    return removeDiacritics((text || "").toString().trim().toLowerCase());
}

// Mapea la categoría que viene en la DB a la categoría del filtro (en minúsculas, sin acentos).
function mapCategoriaDBToFiltro(categoriaDB) {
    const c = norm(categoriaDB);
    if (!c) return "";

    if (c.includes("tv") || c.includes("televisor") || c.includes("tele")) {
        return norm("Electrodomésticos");
    }
    if (c.includes("consol")) return norm("Consolas");
    if (c.includes("placa") || c.includes("motherboard") || c.includes("placas base")) return norm("Placas Base");
    if (c.includes("almacen") || c.includes("hdd") || c.includes("ssd") || c.includes("nvme")) return norm("Almacenamiento");
    if (c.includes("cpu") || c.includes("procesador")) return norm("CPU");
    if (c.includes("gpu") || c.includes("tarjeta") || c.includes("grafica") || c.includes("gráfica")) return norm("GPU");
    if (c.includes("ram") || c.includes("memoria")) return norm("RAM");
    if (c.includes("pc") || c.includes("ordenador") || c.includes("sobremesa")) return norm("PC");

    return c;
}

// Detecta marca leyendo nombreLargo o producto.marca
export function detectarMarca(producto) {
    const texto = norm(producto.nombreLargo || producto.nombreCorto || producto.nombre || "");

    if (producto.marca && typeof producto.marca === "string") {
        const m = producto.marca.trim();
        if (MARCAS_RELEVANTES.map(x => x.toLowerCase()).includes(norm(m))) return m;
    }

    const reglas = [
        { keys: ["ryzen", "amd"], marca: "AMD" },
        { keys: ["intel", "core i", "corei"], marca: "Intel" },
        { keys: ["nvidia", "geforce", "rtx"], marca: "NVIDIA" },
        { keys: ["samsung"], marca: "Samsung" },
        { keys: ["xiaomi"], marca: "Xiaomi" },
        { keys: ["sony", "playstation", "ps5", "ps4"], marca: "Sony" },
        { keys: ["microsoft", "xbox"], marca: "Microsoft" },
        { keys: ["nintendo", "switch"], marca: "Nintendo" }
    ];

    for (const r of reglas) {
        for (const k of r.keys) {
            if (texto.includes(k)) return r.marca;
        }
    }

    return null;
}

// Aplica filtros: categoría, marca y precio mínimo/máximo
export function aplicarFiltros(productos) {
    // Leer mínimo y máximo del DOM
    const precioMinInput = parseFloat(document.getElementById("precio-min")?.value);
    const precioMaxInput = parseFloat(document.getElementById("precio-max")?.value);

    const precioMin = isNaN(precioMinInput) ? 0 : precioMinInput;
    const precioMax = isNaN(precioMaxInput) ? Infinity : precioMaxInput;

    const categoriasSeleccionadas = [...document.querySelectorAll(".filtro-categoria:checked")]
        .map(c => norm(c.value));

    const marcasSeleccionadas = [...document.querySelectorAll(".filtro-marca:checked")]
        .map(m => norm(m.value));

    return productos.filter(p => {
        const categoriaProductoMapeada = mapCategoriaDBToFiltro(p.categoria);
        const coincideCategoria =
            categoriasSeleccionadas.length === 0 ||
            categoriasSeleccionadas.includes(categoriaProductoMapeada);

        const marcaDetectadaRaw = detectarMarca(p);
        const marcaDetectada = marcaDetectadaRaw ? norm(marcaDetectadaRaw) : "";
        const coincideMarca =
            marcasSeleccionadas.length === 0 ||
            (marcaDetectada && marcasSeleccionadas.includes(marcaDetectada));

        const precio = Number(p.precio) || 0;
        const coincidePrecio = precio >= precioMin && precio <= precioMax;

        return coincideCategoria && coincideMarca && coincidePrecio;
    });
}
