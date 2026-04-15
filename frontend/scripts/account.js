// ===============================
// USUARIO
// ===============================
const user = JSON.parse(localStorage.getItem("user"));

if (!user) {
    window.location.href = "login.html";
}

document.getElementById("saludo-usuario").textContent = "Hola, " + user.name;
document.getElementById("nombre-usuario").textContent = user.name;
document.getElementById("email-usuario").textContent = user.email;


// ===============================
// LOGOUT
// ===============================
document.getElementById("cerrar-sesion").addEventListener("click", () => {
    localStorage.removeItem("user");
    window.location.href = "login.html";
});


// ===============================
// FAVORITOS
// ===============================
const contenedor = document.getElementById("contenedor-favoritos");

const favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

contenedor.innerHTML = "";

if (favoritos.length === 0) {
    contenedor.innerHTML = "<p>No tienes favoritos aún</p>";
}

favoritos.forEach(producto => {

    const card = document.createElement("div");
    card.classList.add("producto-card");

    const imagen = producto.imagen || "../recursos/imagenes/default.jpg";

    card.innerHTML = `
        <img class="producto-img" src="${imagen}">
        <h3 class="producto-nombre">${producto.nombre || "Producto"}</h3>
        <p class="producto-precio">${producto.precio || 0} €</p>
    `;

    card.addEventListener("click", () => {
        window.location.href = `producto.html?id=${producto._id}`;
    });

    contenedor.appendChild(card);
});