import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const router = express.Router();

// ===============================
// RUTAS ORIGINALES
// ===============================
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: "Faltan datos" });
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "El usuario ya existe" });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: "Usuario registrado correctamente" });
  } catch (error) { res.status(500).json({ message: "Error en el servidor" }); }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Usuario no encontrado" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Contraseña incorrecta" });
    res.json({ message: "Login exitoso", user: { id: user._id, name: user.name, apellido: user.apellido, sexo: user.sexo, nacimiento: user.nacimiento, email: user.email, createdAt: user.createdAt } });
  } catch (error) { res.status(500).json({ message: "Error en el servidor" }); }
});

router.post("/recover-password", async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Usuario no encontrado" });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();
    res.json({ message: "Contraseña actualizada correctamente" });
  } catch (error) { res.status(500).json({ message: "Error en el servidor" }); }
});

router.put("/update-user/:id", async (req, res) => {
  try {
    const { name, email, password, apellido, sexo, nacimiento } = req.body;
    const updateData = { name, email, apellido, sexo, nacimiento };
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }
    const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json({ message: "Usuario actualizado", user });
  } catch (error) { res.status(500).json({ message: "Error al actualizar" }); }
});

// ===============================
// GUARDAR DATOS (PAGO Y ENVÍO)
// ===============================
router.put("/update-payment/:id", async (req, res) => {
  try {
    const { payCard, cardHolder, expiry } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { billingInfo: { payCard, cardHolder, cvCard: "", expiry } }, { new: true });
    res.json({ message: "Datos guardados", user });
  } catch (error) { res.status(500).json({ message: "Error" }); }
});

router.put("/update-shipping/:id", async (req, res) => {
  try {
    const { nombre, apellidos, movil, direccion, cp, poblacion, provincia } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { shippingInfo: { nombre, apellidos, movil, direccion, cp, poblacion, provincia } }, { new: true });
    res.json({ message: "Dirección guardada", user });
  } catch (error) { res.status(500).json({ message: "Error al guardar dirección" }); }
});

router.get("/get-user-data/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
    res.json(user);
  } catch (error) { res.status(500).json({ message: "Error al obtener datos" }); }
});

export default router;