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
  nuevaSubCategoria,
  obtenerSoloCategorias,
  editarSubCategoria,
  eliminarSubCategoria,
  obtenerCategoriaMercado,
  nuevoSupermercado,
  obtenerSupermercados,
  obtenerProductosSuperMercado,
  nuevoProductoMercado,
  nuevoGastoSupermercado,
} from "../controllers/gastoController.js";

router.post("/nueva-categoria", nuevaCategoria);
router.post("/nueva-sub-categoria", nuevaSubCategoria);
router.post("/nuevo-gasto", nuevoGasto);
router.post("/nuevo-gasto-supermercado", nuevoGastoSupermercado);
router.post("/nuevo-supermercado", nuevoSupermercado);
router.post("/nuevo-producto", nuevoProductoMercado);

router.get("/obtener-categorias/:id", obtenerCategorias);
router.get("/obtener-categoria-mercado/:id", obtenerCategoriaMercado);
router.get("/obtener-solo-categorias/:id", obtenerSoloCategorias);
router.get("/obtener-gastos/:id", obtenerGastos);
router.get("/obtener-chart-gastos-categoria/:id", obtenerGastosPorCategoria);
router.get(
  "/obtener-chart-gastos-acumulados/:id",
  obtenerGastosAcumuladosPorMes
);
router.get("/obtener-dash/:id", obtenerResumenDelMes);
router.get("/obtener-supermercados/:id", obtenerSupermercados);
router.get("/obtener-productos-mercado/:id", obtenerProductosSuperMercado);

router.post("/editar-categoria/:id", editarCategoria);
router.post("/editar-sub-categoria/:id", editarSubCategoria);
router.post("/editar-gasto/:id", editarGasto);

router.delete("/eliminar-categoria/:id", eliminarCategoria);
router.delete("/eliminar-sub-categoria/:id", eliminarSubCategoria);
router.delete("/eliminar-movimiento/:id", eliminarGasto);

export default router;
