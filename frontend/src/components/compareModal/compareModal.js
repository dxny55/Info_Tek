// Inserta el HTML del modal automáticamente
function injectModalHTML() {
    const modalHTML = `
        <div id="modal-comparativa" class="modal-comparativa">
            <div class="modal-contenido">
                <button class="modal-cerrar" id="cerrar-comparativa">X</button>
                <h2 class="modal-titulo">Comparativa de productos</h2>
                <div id="comparativa-contenido"></div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML("beforeend", modalHTML);
}

export function initCompareModal() {
    injectModalHTML();

    const modal = document.getElementById("modal-comparativa");
    const cerrar = document.getElementById("cerrar-comparativa");
    const contenido = document.getElementById("comparativa-contenido");

    cerrar.addEventListener("click", () => {
        modal.style.display = "none";
    });

    return {
        abrir: (productos) => {
            contenido.innerHTML = generarTabla(productos);
            modal.style.display = "flex";
        }
    };
}

function generarTabla(productos) {
    return `
        <table class="comparativa-tabla">
            <tr>
                <th>Característica</th>
                ${productos.map(p => `<th>${p.nombre}</th>`).join("")}
            </tr>

            <tr>
                <td>Imagen</td>
                ${productos.map(p => `
                    <td><img class="comparativa-img" src="/${p.imagenes[0]}"></td>
                `).join("")}
            </tr>

            <tr>
                <td>Precio</td>
                ${productos.map(p => `<td>${p.precio} €</td>`).join("")}
            </tr>

            <tr>
                <td>Stock</td>
                ${productos.map(p => `<td>${p.stock}</td>`).join("")}
            </tr>

            <tr>
                <td>Categoría</td>
                ${productos.map(p => `<td>${p.categoria}</td>`).join("")}
            </tr>
        </table>
    `;
}
