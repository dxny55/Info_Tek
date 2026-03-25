function injectModalHTML() {
    const html = `
    <div id="modal-comparativa" class="modal-comparativa">
        <div class="modal-contenido">
            <button class="modal-cerrar" id="cerrar-comparativa">X</button>

            <div class="modal-header">
                <h2>Comparativa de Productos</h2>
                <p id="comparativa-count"></p>
            </div>

            <div class="grafica-comparativa">
                <div id="canvas-comparativa"></div>
            </div>

            <div id="comparativa-tabla"></div>
        </div>
    </div>
    `;
    document.body.insertAdjacentHTML("beforeend", html);
}

// ===============================
// TABLA DE COMPARACIÓN
// ===============================

function generarTabla(productos) {

    let html = `
    <table class="comparativa-tabla">
        <thead>
            <tr>
                <th>Característica</th>
                ${productos.map(p => `<th>${p.nombreCorto}</th>`).join("")}
            </tr>
        </thead>
        <tbody>

            <tr>
                <td>Imagen</td>
                ${productos.map(p => `
                    <td><img class="comparativa-img" src="../${p.imagenes[0]}"></td>
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
    `;

    // ESPECIFICACIONES REALES
    const keys = new Set();
    productos.forEach(p => {
        Object.keys(p.especificaciones).forEach(k => keys.add(k));
    });

    keys.forEach(key => {
        html += `
        <tr>
            <td>${key}</td>
            ${productos.map(p => `<td>${p.especificaciones[key] || "-"}</td>`).join("")}
        </tr>
        `;
    });

    html += `</tbody></table>`;
    return html;
}

// ===============================
// GRÁFICA COMPARATIVA (APEXCHARTS)
// ===============================

let grafica = null;

function generarGraficaComparativa(productos) {
    const contenedor = document.getElementById("canvas-comparativa");

    if (grafica) grafica.destroy();

    const opciones = {
    chart: {
        type: "line",
        height: 300,
        toolbar: {
            show: true,
            tools: {
                download: false,
                selection: false,
                zoom: false,
                zoomin: true,
                zoomout: true,
                pan: false,
                reset: false
            }
        }
    },
    series: productos.map(p => ({
        name: p.nombreCorto,
        data: p.historialPrecios.map(h => h.precio || null)
    })),
    xaxis: {
        categories: productos[0].historialPrecios.map(h => h.fecha)
    }
};


    grafica = new ApexCharts(contenedor, opciones);
    grafica.render();
}

// ===============================
// INICIALIZAR MODAL
// ===============================

export function initCompareModal() {
    injectModalHTML();

    const modal = document.getElementById("modal-comparativa");
    const cerrar = document.getElementById("cerrar-comparativa");
    const tabla = document.getElementById("comparativa-tabla");
    const count = document.getElementById("comparativa-count");

    cerrar.addEventListener("click", () => {
        modal.style.display = "none";
        if (grafica) grafica.destroy();
    });

    return {
        abrir: (productos) => {
            count.textContent = `Comparando ${productos.length} producto(s)`;

            tabla.innerHTML = generarTabla(productos);

            generarGraficaComparativa(productos);

            modal.style.display = "flex";
        }
    };
}
