const usuario = JSON.parse(localStorage.getItem("user"));

if (usuario) {

  document.getElementById("userMenu").innerHTML = `
    <p>Hola ${usuario.name}</p>
    <button onclick="logout()">Cerrar sesión</button>
  `;

} else {

  document.getElementById("userMenu").innerHTML = `
    <a href="login.html">Login</a>
    <a href="register.html">Registro</a>
  `;

}

function logout() {

  localStorage.removeItem("user");

  alert("Sesión cerrada");

  window.location.reload();

}