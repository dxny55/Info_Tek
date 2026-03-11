// obtener usuario guardado
const user = JSON.parse(localStorage.getItem("user"));

// si no hay usuario -> ir al login
if (!user) {
  window.location.href = "login.html";
}

// mostrar datos
const saludo = document.getElementById("saludo-usuario");
const nombre = document.getElementById("nombre-usuario");
const email = document.getElementById("email-usuario");

if (saludo) saludo.textContent = "Hola, " + user.name;
if (nombre) nombre.textContent = user.name;
if (email) email.textContent = user.email;


// BOTON CERRAR SESION
const btnLogout = document.getElementById("cerrar-sesion");

if (btnLogout) {

  btnLogout.addEventListener("click", () => {

    localStorage.removeItem("user");

    alert("Sesión cerrada");

    window.location.href = "login.html";

  });

}