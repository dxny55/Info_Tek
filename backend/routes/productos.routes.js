import express from "express";
import Producto from "../models/producto.model.js";

const router = express.Router();

// Obtener todos los productos
router.get("/", async (req, res) => {
    try {
        const productos = await Producto.find();
        console.log("Productos obtenidos:", productos.length);
        res.json(productos);
    } catch (error) {
        console.error("Error en GET /api/productos:", error);
        res.status(500).json({ error: "Error al obtener productos" });
    }
});

// Obtener un producto por ID
router.get("/:id", async (req, res) => {
    try {
        const producto = await Producto.findById(req.params.id);
        res.json(producto);
    } catch (error) {
        console.error("Error en GET /api/productos/:id:", error);
        res.status(500).json({ error: "Error al obtener el producto" });
    }
});

export default router;
