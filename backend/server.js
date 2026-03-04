const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();



const app = express();

// Middlewares
app.use(cors());
app.use(express.json());


//=========================
//=========================


// Usamos solo el Shard 00-00 directamente
const uri = process.env.MONGO_URI; //"mongodb://danielcabello_db_user:ksiicwQe5e3Yfhe@ac-vaxb0gt-shard-00-00.wv2wl6q.mongodb.net:27017/Infotek?ssl=true&authSource=admin";

const clientOptions = {
  family: 4,
  serverSelectionTimeoutMS: 10000, // Bajamos a 10s para no esperar tanto
  directConnection: true // <--- ESTO ES LA CLAVE: obliga a conectar a este servidor sí o sí
};

async function connexionMongoDB() {
  try {
    console.log("Intentando bypass de DNS...");
    await mongoose.connect(uri, clientOptions);
    console.log("✅ Conectado correctamente con MongoDB Atlas.");
  } catch (err) {
    console.error("❌ Error conectando a MongoDB Atlas. Error:");
    console.error(err);
  }
}
connexionMongoDB();

// Rutas
const productosRoutes = require("./routes/productos.routes");
app.use("/api/productos", productosRoutes);

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor backend en http://localhost:${PORT}`);
});
