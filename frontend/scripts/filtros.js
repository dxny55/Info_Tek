// ===============================
// CONFIGURACIÓN
// ===============================

// Marcas válidas según tu MongoDB (todas en minúsculas)
const MARCAS_RELEVANTES = [
    "amd", "intel", "nvidia", "samsung",
    "xiaomi", "sony", "microsoft", "nintendo"
];

// Normaliza texto: minúsculas + sin acentos
function removeDiacritics(str) {
    return (str || "").normalize("NFD").replace(/\p{Diacritic}/gu, "");
}
function norm(text) {
    return removeDiacritics((text || "").trim().toLowerCase());
}

// ===============================
// MAPEO DE CATEGORÍAS DESDE MONGO
// ===============================

function mapCategoriaDBToFiltro(categoriaDB) {
    const c = norm(categoriaDB);
    if (!c) return "";

    if (c.includes("tv") || c.includes("tele")) return "electrodomesticos";
    if (c.includes("consol")) return "consolas";
    if (c.includes("placa") || c.includes("motherboard")) return "placas base";
    if (c.includes("almacen") || c.includes("ssd") || c.includes("hdd")) return "almacenamiento";
    if (c.includes("cpu") || c.includes("procesador")) return "cpu";
    if (c.includes("gpu") || c.includes("grafica")) return "gpu";
    if (c.includes("ram") || c.includes("memoria")) return "ram";
    if (c.includes("pc") || c.includes("ordenador")) return "pc";

    return c;
}

// ===============================
// APLICAR FILTROS
// ===============================

export function aplicarFiltros(productos) {

    // --- PRECIO ---
    const precioMin = Number(document.getElementById("precio-min")?.value) || 0;
    const precioMax = Number(document.getElementById("precio-max")?.value) || Infinity;

    // --- CATEGORÍAS ---
    const categoriasSeleccionadas = [...document.querySelectorAll(".filtro-categoria:checked")]
        .map(c => norm(c.value));

    // --- MARCAS ---
    const marcasSeleccionadas = [...document.querySelectorAll(".filtro-marca:checked")]
        .map(m => norm(m.value));

    return productos.filter(p => {

        // CATEGORÍA
        const categoriaMap = mapCategoriaDBToFiltro(p.categoria);
        const coincideCategoria =
            categoriasSeleccionadas.length === 0 ||
            categoriasSeleccionadas.includes(categoriaMap);

        // MARCA (directo desde Mongo)
        const marca = norm(p.marca || "");
        const coincideMarca =
            marcasSeleccionadas.length === 0 ||
            marcasSeleccionadas.includes(marca);

        // PRECIO
        const precio = Number(p.precio) || 0;
        const coincidePrecio = precio >= precioMin && precio <= precioMax;

        return coincideCategoria && coincideMarca && coincidePrecio;
    });
}
document.addEventListener("DOMContentLoaded", () => {

    const btnToggle = document.getElementById("btn-toggle-filtros");
    const sidebar = document.getElementById("filtro-lateral");
    const overlay = document.getElementById("filtro-overlay");

    if (!btnToggle || !sidebar) return;

    // Función para abrir filtros
    function abrirFiltros() {
        sidebar.classList.add("abierto");
        if (overlay) overlay.classList.add("activo");
        document.body.style.overflow = "hidden"; // Evita scroll del body
    }

    // Función para cerrar filtros
    function cerrarFiltros() {
        sidebar.classList.remove("abierto");
        if (overlay) overlay.classList.remove("activo");
        document.body.style.overflow = ""; // Restaura scroll
    }

    // Abrir/cerrar sidebar con botón
    btnToggle.addEventListener("click", (e) => {
        e.stopPropagation();
        if (sidebar.classList.contains("abierto")) {
            cerrarFiltros();
        } else {
            abrirFiltros();
        }
    });

    // Cerrar al hacer clic en el overlay
    if (overlay) {
        overlay.addEventListener("click", () => {
            cerrarFiltros();
        });
    }

    // Evitar cierre al clicar dentro del sidebar
    sidebar.addEventListener("click", (e) => {
        e.stopPropagation();
    });

    // Reset en desktop
    window.addEventListener("resize", () => {
        if (window.innerWidth > 1100) {
            cerrarFiltros();
        }
    });

});