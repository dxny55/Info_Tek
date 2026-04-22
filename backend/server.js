import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import productosRoutes from "./routes/productos.routes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

// Necesario para obtener __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(cors());
app.use(express.json());

// ===============================
// SERVIR CARPETA RECURSOS (RUTA ABSOLUTA REAL)
// ===============================
app.use(
  "/recursos",
  express.static(
    "C:/Users/d.cabello/Documents/Info-Tek_007/Info_Tek/frontend/recursos"
  )
);

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

// Rutas API
app.use("/api/productos", productosRoutes);
app.use("/api/auth", authRoutes);

// Servidor
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor backend en http://localhost:${PORT}`);
});
