document.addEventListener("DOMContentLoaded", () => {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    const subtotal = carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0);

    document.getElementById("subtotal").textContent = subtotal.toFixed(2) + "€";
    document.getElementById("total").textContent = subtotal.toFixed(2) + "€";
});
