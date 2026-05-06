// ===============================
// 1. INYECTAR HTML DEL MODAL
// ===============================
function injectModalHTML() {
    // Si ya existe, no lo duplicamos
    if (document.getElementById("modal-comparativa")) return;

    const html = `
    <div id="modal-comparativa" class="modal-comparativa" style="display:none;">
        <div class="modal-contenido">
            <button class="modal-cerrar" id="cerrar-comparativa">X</button>

            <div class="modal-header">
                <h2>Comparativa de Productos</h2>
                <p id="comparativa-count"></p>
            </div>

            <div class="grafica-comparativa">
                <div id="canvas-comparativa"></div>
            </div>

            <div id="comparativa-tabla-contenedor"></div>
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
                ${productos.map(p => `<td>${p.stock} u.</td>`).join("")}
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
// 3. GRÁFICA COMPARATIVA (APEXCHARTS)
// ===============================

let grafica = null;

function generarGraficaComparativa(productos) {
    const contenedor = document.getElementById("canvas-comparativa");
    if (!contenedor) return;

    if (grafica) grafica.destroy();

    // Extraer fechas del primer producto como referencia para el eje X
    const categoriasX = productos[0]?.historialPrecios?.map(h => h.fecha) || ["Semana 1", "Semana 2", "Semana 3", "Semana 4"];

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
// 4. INICIALIZAR E INTERFAZ
// ===============================

export function initCompareModal() {
    injectModalHTML();

    const modal = document.getElementById("modal-comparativa");
    const cerrar = document.getElementById("cerrar-comparativa");
    const tablaContenedor = document.getElementById("comparativa-tabla-contenedor");
    const countLabel = document.getElementById("comparativa-count");

    // Evento cerrar
    cerrar.addEventListener("click", () => {
        modal.style.display = "none";
        // No destruimos la gráfica aquí para evitar parpadeos, 
        // se destruye al abrir una nueva.
    });

    // Cerrar al hacer clic fuera del contenido
    modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.style.display = "none";
    });

    return {
        abrir: (productos) => {
            if (!productos || productos.length === 0) return;

            countLabel.textContent = `Comparando ${productos.length} producto(s)`;
            
            // 1. Generar la tabla
            tablaContenedor.innerHTML = generarTabla(productos);

            generarGraficaComparativa(productos);

            modal.style.display = "flex";

            // 3. Generar la gráfica con ApexCharts
            // Usamos un pequeño timeout para asegurar que el contenedor es visible
            setTimeout(() => {
                generarGraficaComparativa(productos);
            }, 100);
        }
    };
}