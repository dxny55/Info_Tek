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

async function cargarGraficaComparativa(identifications) {
    const res = await fetch("../data/precios.json");
    const data = await res.json();

    const productos = data.productos.filter(p =>
        identifications.includes(p.identification)
    );

    generarGraficaComparativa(productos);
}

function generarGraficaComparativa(productos) {
    const contenedor = document.getElementById("canvas-comparativa");

    if (grafica) {
        grafica.destroy();
    }

    const opciones = {
        chart: {
            type: "line",
            height: 300
        },
        series: productos.map(p => ({
            name: p.slug.replace(/_/g, " "),
            data: p.precios
        })),
        xaxis: {
            categories: ["Semana 1", "Semana 2", "Semana 3", "Semana 4"]
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

            const ids = productos.map(p => p.identification);
            cargarGraficaComparativa(ids);

            modal.style.display = "flex";
        }
    };
}
