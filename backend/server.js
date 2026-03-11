import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import productosRoutes from "./routes/productos.routes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// MongoDB
const uri = process.env.MONGO_URI;

const clientOptions = {
  serverSelectionTimeoutMS: 10000,
};

async function connexionMongoDB() {
  try {
    console.log("Intentando conexión MongoDB...");
    await mongoose.connect(uri, clientOptions);
    console.log("✅ Conectado correctamente con MongoDB Atlas.");
  } catch (err) {
    console.error("❌ Error conectando a MongoDB Atlas:");
    console.error(err);
  }
}

connexionMongoDB();

// Rutas
app.use("/api/productos", productosRoutes);
app.use("/api/auth", authRoutes);

// Servidor
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor backend en http://localhost:${PORT}`);
});