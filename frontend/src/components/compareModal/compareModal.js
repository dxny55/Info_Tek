// ===============================
// INYECTAR MODAL
// ===============================
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
// PARSEAR ESPECIFICACIONES
// ===============================
function parseSpecs(descripcion) {
    const specs = {};
    if (!descripcion) return specs;

    const partes = descripcion.split(",");

    partes.forEach(p => {
        const texto = p.trim().toLowerCase();

        if (texto.includes("núcleo")) specs["Núcleos"] = texto.match(/\d+/)?.[0];
        if (texto.includes("hilo")) specs["Hilos"] = texto.match(/\d+/)?.[0];
        if (texto.includes("ghz")) specs["Frecuencia Turbo"] = texto.match(/[\d.]+ghz/i)?.[0];
        if (texto.includes("arquitectura")) specs["Arquitectura"] = texto.replace("arquitectura", "").trim();
        if (texto.includes("socket")) specs["Socket"] = texto.replace("socket", "").trim().toUpperCase();
    });

    return specs;
}

// ===============================
// TABLA COMPARATIVA
// ===============================
function generarTabla(productos) {
    const specsUnificadas = new Set();

    productos.forEach(p => {
        const specs = parseSpecs(p.descripcion);
        Object.keys(specs).forEach(k => specsUnificadas.add(k));
    });

    let html = `
    <table class="comparativa-tabla">
        <thead>
            <tr>
                <th>Característica</th>
                ${productos.map(p => `<th>${p.nombre}</th>`).join("")}
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Imagen</td>
                ${productos.map(p => `
                    <td><img class="comparativa-img" src="/${p.imagenes[0]}"></td>
                `).join("")}
            </tr>

            <tr>
                <td>Precio</td>
                ${productos.map(p => `<td class="precio">${p.precio} €</td>`).join("")}
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

    specsUnificadas.forEach(key => {
        html += `
        <tr>
            <td>${key}</td>
            ${productos.map(p => {
                const specs = parseSpecs(p.descripcion);
                return `<td>${specs[key] || "-"}</td>`;
            }).join("")}
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

async function cargarGraficaComparativa(identifications, idToName) {
    const res = await fetch("../data/precios.json");
    const data = await res.json();

    const idsUpper = identifications.map(id => id.toUpperCase().trim());

    const productos = data.precios.filter(p =>
        idsUpper.includes(p.identificacion.toUpperCase().trim())
    );

    generarGraficaComparativa(productos, idToName);
}

function generarGraficaComparativa(productos, idToName) {
    const contenedor = document.getElementById("canvas-comparativa");

    if (grafica) grafica.destroy();

    const fechas = [
        ...new Set(
            productos.flatMap(p => p.historial.map(h => h.fecha))
        )
    ].sort();

    const fechasISO = fechas.map(f => new Date(f).toISOString());

    const series = productos.map(p => {
        const id = p.identificacion.toUpperCase().trim();
        const nombreReal = idToName[id] || p.identificacion;

        return {
            name: nombreReal,
            data: fechasISO.map(fISO => {
                const fechaOriginal = fISO.split("T")[0];
                const registro = p.historial.find(h => h.fecha === fechaOriginal);
                return registro ? registro.precio : null;
            })
        };
    });

    // 🔥 AQUÍ VA EL BLOQUE QUE ME PREGUNTASTE 🔥
    const opciones = {
        chart: {
            type: "line",
            height: 300,
            toolbar: {
                show: true,
                tools: {
                    download: false,
                    selection: false,
                    zoom: true,
                    zoomin: true,
                    zoomout: true,
                    pan: false,
                    reset: false
                }
            }
        },
        series: series,
        xaxis: {
            type: "datetime",
            categories: fechasISO,
            title: { text: "Fecha" }
        },
        yaxis: {
            title: { text: "Precio (€)" }
        },
        stroke: {
            width: 3,
            curve: "smooth"
        },
        markers: {
            size: 4
        },
        legend: {
            position: "top"
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

            // Crear mapa ID → nombre real
            const idToName = {};
            productos.forEach(p => {
                const id = (p.identification || p.identificacion || p.id || "").toUpperCase().trim();
                idToName[id] = p.nombre;
            });

            // IDs normalizados
            const ids = Object.keys(idToName);

            cargarGraficaComparativa(ids, idToName);

            modal.style.display = "flex";
        }
    };
}
