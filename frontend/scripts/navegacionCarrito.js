// ==========================================================================
// NAVEGACIONCARRITO.JS - LOGICA DE NOTIFICACIÓN DE PRODUCTOS ÚNICOS
// ==========================================================================

export function actualizarContadorCarritoGlobal() {
    const badge = document.getElementById("carrito-count");
    if (!badge) return;

    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    
    // 🌟 REGLA: Contamos filas de productos distintos (longitud del array)
    const productosUnicos = carrito.length;

    if (productosUnicos > 0) {
        badge.textContent = productosUnicos;
        badge.style.display = "flex"; // Forzamos vista en CSS como notificación
    } else {
        badge.style.display = "none";  // Ocultado absoluto si está vacío
    }
}

// Exponemos la función a la ventana global (window) por si scripts tradicionales 
// que no son módulos ES6 necesitan invocar la actualización tras un evento.
window.actualizarContadorCarritoGlobal = actualizarContadorCarritoGlobal;

// Autoejecución al cargar la pestaña actual
document.addEventListener("DOMContentLoaded", () => {
    actualizarContadorCarritoGlobal();
});