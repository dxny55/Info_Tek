import mongoose from "mongoose";

const productoSchema = new mongoose.Schema({
    identificacion: String,
    nombre: String,
    precio: Number,
    stock: Number,
    categoria: String,
    descripcion: String,
    imagen: String,
    marca: String
});

const Producto = mongoose.model("Producto", productoSchema, "Products");

export default Producto;
