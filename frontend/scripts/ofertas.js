// ===============================
// CARRUSEL DE OFERTAS (rueda infinita)
// ===============================

const carrusel = document.getElementById("ofertasCarrusel");
const btnLeft = document.querySelector(".oferta-btn.left");
const btnRight = document.querySelector(".oferta-btn.right");

// Tamaño del desplazamiento (ajústalo si tus imágenes cambian)
const desplazamiento = 350;

// Flecha derecha → avanza
btnRight?.addEventListener("click", () => {
    const maxScroll = carrusel.scrollWidth - carrusel.clientWidth;

    if (carrusel.scrollLeft >= maxScroll - 10) {
        // Si está al final → vuelve al inicio
        carrusel.scrollTo({ left: 0, behavior: "smooth" });
    } else {
        carrusel.scrollBy({ left: desplazamiento, behavior: "smooth" });
    }
});

// Flecha izquierda → retrocede
btnLeft?.addEventListener("click", () => {
    if (carrusel.scrollLeft <= 0) {
        // Si está al inicio → salta al final
        const maxScroll = carrusel.scrollWidth - carrusel.clientWidth;
        carrusel.scrollTo({ left: maxScroll, behavior: "smooth" });
    } else {
        carrusel.scrollBy({ left: -desplazamiento, behavior: "smooth" });
    }
});
