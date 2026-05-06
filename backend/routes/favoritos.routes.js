import express from "express";
import Favorito from "../models/Favorito.js";

const router = express.Router();

router.get("/:usuarioId", async (req, res) => {
  const favoritos = await Favorito.find({
    usuarioId: req.params.usuarioId
  }).populate("productoId");

  res.json(favoritos);
});

router.post("/", async (req, res) => {
  const { usuarioId, productoId } = req.body;

  const existe = await Favorito.findOne({ usuarioId, productoId });

  if (!existe) {
    await new Favorito({ usuarioId, productoId }).save();
  }

  res.json({ ok: true });
});

router.delete("/", async (req, res) => {
  const { usuarioId, productoId } = req.body;

  await Favorito.deleteOne({ usuarioId, productoId });

  res.json({ ok: true });
});

export default router;