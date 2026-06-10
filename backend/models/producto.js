import mongoose from "mongoose";

const productoSchema = new mongoose.Schema({
  nombreCorto: String,
  nombreLargo: String,
  precio: Number,
  categoria: String,
  stock: Number,
  rating: Number,
  imagenes: [String], // aquí pondremos las imágenes en Base64
  especificaciones: Object,
  historialPrecios: Array
});

export default mongoose.model("Producto", productoSchema, "Products");

