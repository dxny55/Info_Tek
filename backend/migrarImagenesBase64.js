import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import Producto from "./models/producto.js";

async function convertirImagenARutaBase64(ruta) {
  const datos = fs.readFileSync(ruta);
  const ext = path.extname(ruta).toLowerCase();

  const mime =
    ext === ".png" ? "image/png" :
    ext === ".webp" ? "image/webp" :
    "image/jpeg";

  return `data:${mime};base64,${datos.toString("base64")}`;
}

async function migrar() {
  console.log("Conectando a MongoDB...");
  await mongoose.connect(process.env.MONGO_URI);

  console.log("Conectado. Leyendo productos...");
  const productos = await Producto.find();

      for (const producto of productos) {
        if (!producto.imagenes || producto.imagenes.length === 0) continue;

        const nuevasImagenes = [];

        for (const rutaRelativa of producto.imagenes) {

      const rutaCompleta = path.join(
        process.cwd(),
        "frontend",
        "recursos",
        rutaRelativa.replace("recursos/", "imagenes/")
      );

      if (!fs.existsSync(rutaCompleta)) {
        console.log("❌ No encontrada:", rutaCompleta);
        continue;
      }

      const base64 = await convertirImagenARutaBase64(rutaCompleta);
      nuevasImagenes.push(base64);
    }


    producto.imagenes = nuevasImagenes;
    await producto.save();

    console.log(`✅ Migrado: ${producto.nombreCorto}`);
  }

  console.log("🎉 Migración completada.");
  process.exit();
}

migrar();
