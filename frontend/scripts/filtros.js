// ==========================================================================
// FILTROS.JS - CONFIGURACIÓN Y MIGRACIÓN DE DATOS (COMPLETO)
// ==========================================================================

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

// ==========================================================================
// MAPEO DE CATEGORÍAS DESDE MONGO
// ==========================================================================

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

// ==========================================================================
// APLICAR FILTROS (MÓDULO EXPORTABLE)
// ==========================================================================

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

// ==========================================================================
// CONTROL DEL PANEL (MOBILE) Y LOGICA DE LIMPIEZA TOTAL
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {

    const btnToggle = document.getElementById("btn-toggle-filtros");
    const sidebar = document.getElementById("filtro-lateral");
    const overlay = document.getElementById("filtro-overlay");
    const btnCerrar = document.getElementById("cerrar-filtros");
    
    // Capturamos el botón de limpiar filtros
    const btnLimpiar = document.getElementById("btn-limpiar-filtros");

    // LÓGICA DE APERTURA / CIERRE PARA MÓVILES
    function abrirFiltros() {
        if (sidebar) sidebar.classList.add("abierto");
        document.body.style.overflow = "hidden"; 
    }

    function cerrarFiltros() {
        if (sidebar) sidebar.classList.remove("abierto");
        document.body.style.overflow = ""; 
    }

    if (btnToggle && sidebar) {
        btnToggle.addEventListener("click", (e) => {
            e.stopPropagation();
            abrirFiltros();
        });
    }

    if (btnCerrar) {
        btnCerrar.addEventListener("click", () => {
            cerrarFiltros();
        });
    }

    if (overlay) {
        overlay.addEventListener("click", () => {
            cerrarFiltros();
        });
    }

    if (sidebar) {
        sidebar.addEventListener("click", (e) => {
            e.stopPropagation();
        });
    }

    window.addEventListener("resize", () => {
        if (window.innerWidth > 1100) {
            cerrarFiltros();
        }
    });

    // ==========================================================================
    // PROGRAMACIÓN ACCIÓN: BOTÓN "LIMPIAR FILTROS" (REFRESCO EN TIEMPO REAL)
    // ==========================================================================
    if (btnLimpiar) {
        btnLimpiar.addEventListener("click", () => {
            
            // 1. Limpiamos los campos numéricos del rango de precios
            const pMin = document.getElementById("precio-min");
            const pMax = document.getElementById("precio-max");
            if (pMin) pMin.value = "";
            if (pMax) pMax.value = "";

            // 2. Desmarcamos todos los checkboxes de categorías
            document.querySelectorAll(".filtro-categoria:checked").forEach(cb => {
                cb.checked = false;
            });

            // 3. Desmarcamos todos los checkboxes de marcas
            document.querySelectorAll(".filtro-marca:checked").forEach(cb => {
                cb.checked = false;
            });

            // 4. Vaciamos la barra grande del buscador principal por si tuviera texto
            const buscador = document.querySelector(".buscador");
            if (buscador) buscador.value = "";

            // 5. 🚀 DISPARADOR DE CAMBIO NATIVO:
            // Forzamos un evento de cambio en los inputs para que 'cargarProductos.js'
            // se de cuenta de que la selección ha cambiado a cero y refresque el DOM.
            const eventoCambio = new Event("change", { bubbles: true });
            const algunCheckbox = document.querySelector(".filtro-categoria, .filtro-marca");
            
            if (algunCheckbox) {
                algunCheckbox.dispatchEvent(eventoCambio);
            } else if (pMin) {
                // Alternativa de seguridad por si no hay checkboxes cargados aún
                pMin.dispatchEvent(new Event("input", { bubbles: true }));
            }
        });
    }
});