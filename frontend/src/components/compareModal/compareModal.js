function injectModalHTML() {
    const html = `
    <div id="modal-comparativa" class="modal-comparativa">
        <div class="modal-contenido">
            <button class="modal-cerrar" id="cerrar-comparativa">X</button>

            <div class="modal-header">
                <h2>Comparativa de Productos</h2>
                <p id="comparativa-count"></p>
            </div>

            <div id="comparativa-grafico"></div>

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

export function initCompareModal() {
    injectModalHTML();

    const modal = document.getElementById("modal-comparativa");
    const cerrar = document.getElementById("cerrar-comparativa");
    const tabla = document.getElementById("comparativa-tabla");
    const count = document.getElementById("comparativa-count");

    cerrar.addEventListener("click", () => {
        modal.style.display = "none";
    });

    return {
        abrir: (productos) => {
            count.textContent = `Comparando ${productos.length} producto(s)`;
            tabla.innerHTML = generarTabla(productos);
            modal.style.display = "flex";
        }
    };
}
