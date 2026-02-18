const contenedor = document.getElementById("lista-productos");
const contador = document.getElementById("contador-productos");

async function cargarProductos() {
    try {
        const res = await fetch("http://localhost:3000/api/productos");
        const productos = await res.json();

        contenedor.innerHTML = "";
        contador.textContent = `${productos.length} productos`;

        productos.forEach(p => {
            const cambio = p.cambioPrecio;
            const claseCambio = cambio >= 0 ? "positivo" : "negativo";

            contenedor.innerHTML += `
                <div class="producto-card">
                    <span class="categoria">${p.categoria}</span>
                    <img src="../recursos/imagenes/${p.imagen}" alt="${p.nombre}">
                    <h3 class="marca">${p.marca}</h3>
                    <h2 class="nombre">${p.nombre}</h2>

                    <p class="rating">⭐ ${p.rating} <span>(${p.stock} disponibles)</span></p>

                    <div class="precios">
                        <span class="precio-actual">$${p.precioActual}</span>
                        <span class="precio-anterior">$${p.precioAnterior}</span>
                        <span class="precio-cambio ${claseCambio}">
                            ${cambio > 0 ? "+" : ""}${cambio}%
                        </span>
                    </div>

                    <button class="btn-detalle" onclick="verDetalle('${p._id}')">
                        Ver detalle
                    </button>
                </div>
            `;
        });

    } catch (error) {
        console.error("Error cargando productos:", error);
    }
}

cargarProductos();

function verDetalle(id) {
    window.location.href = `producto.html?id=${id}`;
}
