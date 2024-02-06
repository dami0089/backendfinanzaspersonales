import express from "express";

const router = express.Router();

import {
  registrar,
  autenticar,
  confirmar,
  olvidePassword,
  comprobarToken,
  nuevoPassword,
  perfil,
  comprobarUsuario,
  obtenerUsuario,
  editarUsuario,
  crearPassword,
  editarDatosUsuario,
  obtenerDatosUsuario,
} from "../controllers/usuariosController.js";
import checkAuth from "../middleware/checkAuth.js";

router.post("/registrar/", registrar); // crea un nuevo usuario
router.post("/confirmar/:token", confirmar);
router.post("/login", autenticar);

router.post("/nueva-pass/:token", crearPassword);

router.post("/olvide-password", olvidePassword);

router.post("/editar-usuario/:id", editarDatosUsuario);

router.post("/obtener-datos-usuario/:id", obtenerDatosUsuario);

router.get("/perfil", checkAuth, perfil);

export default router;
