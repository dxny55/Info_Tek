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
// EDITAR USUARIO
// ===============================
const btnEditar = document.querySelector(".btn");

if (btnEditar) {

    btnEditar.addEventListener("click", async () => {

        const nuevoNombre = prompt("Cambiar nombre de usuario:", user.name);
        if (nuevoNombre === null) return;

        const nuevoEmail = prompt("Cambiar email:", user.email);
        if (nuevoEmail === null) return;

        const nuevaPassword = prompt("Cambiar contraseña:");
        if (nuevaPassword === null) return;

        try {

            const res = await fetch(`http://localhost:3000/api/auth/update-user/${user.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: nuevoNombre,
                    email: nuevoEmail,
                    password: nuevaPassword
                })
            });

            const data = await res.json();

            alert(data.message);

            if (res.ok) {
                localStorage.setItem("user", JSON.stringify(data.user));
                location.reload();
            }

        } catch (error) {
            console.error(error);
            alert("Error al actualizar usuario");
        }

    });

}


// ===============================
// FAVORITOS (LOCAL TEMPORAL)
// ===============================
const contenedor = document.getElementById("contenedor-favoritos");

if (contenedor) {

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
}