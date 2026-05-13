document.addEventListener("DOMContentLoaded", () => {

    // ===============================
    // CARGAR CARRITO Y MOSTRAR TOTAL
    // ===============================
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const subtotal = carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0);

    document.getElementById("subtotal").textContent = subtotal.toFixed(2) + "€";
    document.getElementById("total").textContent = subtotal.toFixed(2) + "€";


    // ===============================
    // FORMULARIO DE ENVÍO
    // ===============================
    const formEnvio = document.getElementById("form-envio");
    const pagoSection = document.getElementById("pago-section");
    const btnGuardarEnvio = document.getElementById("btn-guardar-envio");

    function validarEnvio() {
        const inputs = formEnvio.querySelectorAll("input, select");

        for (let input of inputs) {
            if (input.hasAttribute("required") && input.value.trim() === "") {
                return false;
            }
        }
        return true;
    }

    function guardarDatosEnvio() {
        const datos = {};

        formEnvio.querySelectorAll("input, select").forEach(input => {
            const label = input.labels[0].innerText.replace("*", "");
            datos[label] = input.value;
        });

        localStorage.setItem("datosEnvio", JSON.stringify(datos));
    }

    function mostrarMensaje(texto, tipo = "ok") {
    const div = document.createElement("div");
    div.className = tipo === "ok" ? "msg-ok" : "msg-error";
    div.textContent = texto;

    // Mostrar mensaje ANTES del botón
    btnGuardarEnvio.insertAdjacentElement("beforebegin", div);

    setTimeout(() => div.remove(), 2500);
}

    formEnvio.addEventListener("submit", (e) => {
        e.preventDefault();

        if (!validarEnvio()) {
            mostrarMensaje("Por favor complete todos los campos obligatorios", "error");
            return;
        }

        guardarDatosEnvio();
        mostrarMensaje("Datos guardados correctamente");

        // Mostrar sección de pago
        pagoSection.classList.remove("oculto");

        // Cambiar botón
        btnGuardarEnvio.textContent = "Información guardada";
        btnGuardarEnvio.disabled = true;
    });


    // ===============================
    // FORMULARIO DE TARJETA
    // ===============================
    const btnPagar = document.getElementById("btn-pagar");

    function validarTarjeta() {
        const num = document.getElementById("card-number").value.trim();
        const exp = document.getElementById("card-exp").value.trim();
        const cvv = document.getElementById("card-cvv").value.trim();
        const name = document.getElementById("card-name").value.trim();

        const regexNum = /^[0-9]{16}$/;
        const regexExp = /^(0[1-9]|1[0-2])\/\d{2}$/;
        const regexCVV = /^[0-9]{3}$/;

        if (!regexNum.test(num)) return false;
        if (!regexExp.test(exp)) return false;
        if (!regexCVV.test(cvv)) return false;
        if (name.length < 3) return false;

        return true;
    }

    btnPagar.addEventListener("click", () => {
        if (!validarTarjeta()) {
            mostrarMensaje("Datos de tarjeta inválidos", "error");
            return;
        }

        mostrarMensaje("Pago procesado correctamente");

        setTimeout(() => {
            window.location.href = "./confirmacion.html";
        }, 1500);
    });

});
