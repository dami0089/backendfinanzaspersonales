import express from "express";

const router = express.Router();

import {
  nuevoGasto,
  nuevaCategoria,
  obtenerCategorias,
  editarCategoria,
  eliminarCategoria,
  obtenerGastos,
  editarGasto,
  obtenerGastosPorCategoria,
  obtenerGastosAcumuladosPorMes,
  obtenerResumenDelMes,
  eliminarGasto,
} from "../controllers/gastoController.js";

router.post("/nueva-categoria", nuevaCategoria);
router.post("/nuevo-gasto", nuevoGasto);

router.get("/obtener-categorias/:id", obtenerCategorias);
router.get("/obtener-gastos/:id", obtenerGastos);
router.get("/obtener-chart-gastos-categoria/:id", obtenerGastosPorCategoria);
router.get(
  "/obtener-chart-gastos-acumulados/:id",
  obtenerGastosAcumuladosPorMes
);
router.get("/obtener-dash/:id", obtenerResumenDelMes);

router.post("/editar-categoria/:id", editarCategoria);
router.post("/editar-gasto/:id", editarGasto);

router.delete("/eliminar-categoria/:id", eliminarCategoria);
router.delete("/eliminar-movimiento/:id", eliminarGasto);

export default router;
