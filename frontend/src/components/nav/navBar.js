export function cargarNav() {
    fetch("../src/components/nav/navBar.html")
        .then(res => res.text())
        .then(html => {
            document.getElementById("encabezado").innerHTML = html;
        });
}