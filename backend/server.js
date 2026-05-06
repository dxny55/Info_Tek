import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import productosRoutes from "./routes/productos.routes.js";
import authRoutes from "./routes/authRoutes.js";
import favoritosRoutes from "./routes/favoritos.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const uri = process.env.MONGO_URI;

async function connexionMongoDB() {
  try {
    await mongoose.connect(uri);
    console.log("✅ MongoDB conectado");
  } catch (err) {
    console.error(err);
  }
}

connexionMongoDB();

// RUTAS
app.use("/api/productos", productosRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/favoritos", favoritosRoutes);

app.listen(3000, () => {
  console.log("Servidor en http://localhost:3000");
});