const mongoose = require("mongoose");

const productoSchema = new mongoose.Schema({
    identificacion: String,
    nombre: String,
    precio: Number,
    stock: Number,
    categoria: String,
    descripcion: String,
    imagen: String,      // opcional
    marca: String        // opcional
});

module.exports = mongoose.model("Producto", productoSchema, "Products");

