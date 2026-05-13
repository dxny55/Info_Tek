import mongoose from "mongoose";

const productoSchema = new mongoose.Schema({
  identificacion: String,
  slug: String,
  precio: Number,
  precioAnterior: Number,
  stock: Number,
  categoria: String,
  marca: String,
  nombreCorto: String,
  nombreLargo: String,
  imagenes: [String],
  descripcionCorta: String,
  descripcionLarga: Array,
  especificaciones: Object,
  caracteristicasDestacadas: Array,
  informacionCompra: Object,
  historialPrecios: Array,
  rating: Number
});

// Forzamos a usar la colección "Products"
export default mongoose.model("Producto", productoSchema, "Products");
