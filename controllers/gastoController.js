import Categoria from "../models/Categoria.js";
import Gasto from "../models/gasto.js";

const nuevaCategoria = async (req, res) => {
  const categoria = new Categoria(req.body);

  try {
    await categoria.save();
    res.json({ msg: "Categoria guardado correctamente" });
  } catch (error) {
    res.status(500).json({ msg: "Error al grabar Categoria" });
  }
};

const nuevoGasto = async (req, res) => {
  const gasto = new Gasto(req.body);

  const categoria = await Categoria.findById(gasto.categoria);

  gasto.nombreCategoria = categoria.nombre;

  try {
    await gasto.save();
    res.json({ msg: "Gasto guardado correctamente" });
  } catch (error) {
    res.status(500).json({ msg: "Error al grabar gasto" });
  }
};

const obtenerCategorias = async (req, res) => {
  const { id } = req.params;

  const categorias = await Categoria.find({ usuario: id });

  try {
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener categorias" });
    console.log(error);
  }
};

const editarCategoria = async (req, res) => {
  const { id } = req.params;

  const categoria = await Categoria.findById(id);

  try {
    categoria.nombre = req.body.nombre || categoria.nombre;
    await categoria.save();
    res.json({ msg: "Categoria Editada Correctamente" });
  } catch (error) {
    res.status(500).json({ msg: "Error al editar categoriaa" });
    console.log(error);
  }
};

const eliminarCategoria = async (req, res) => {
  const { id } = req.params;

  try {
    // Encuentra la categoría por su ID y elimínala
    const categoria = await Categoria.findByIdAndDelete(id);

    if (!categoria) {
      return res.status(404).json({ msg: "Categoría no encontrada" });
    }

    res.json({ msg: "Categoría eliminada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al eliminar la categoría" });
  }
};

const obtenerGastos = async (req, res) => {
  const { id } = req.params;
  try {
    // Ordena por '_id' descendente para obtener los más recientes primero
    const gastos = await Gasto.find({ usuario: id })
      .sort({ _id: -1 }) // Ordena los documentos por '_id' descendente
      .limit(20); // Limita a los últimos 20 documentos

    res.json(gastos);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error al obtener gastos" });
  }
};

const editarGasto = async (req, res) => {
  const { id } = req.params;

  const gasto = await Gasto.findById(id);

  try {
    gasto.fecha = req.body.fecha;
    gasto.concepto = req.body.concepto;
    gasto.descripcion = req.body.descripcion;

    if (gasto.categoria != req.body.categoria) {
      const categoria = await Categoria.findById(req.body.categoria);

      gasto.nombreCategoria = categoria.nombre;
      gasto.categoria = req.body.categoria;
    }
    gasto.importe = req.body.importe;

    await gasto.save();
    res.json({ msg: "Gasto Editado Correctamente" });
  } catch (error) {
    res.status(500).json({ msg: "Error al editar Gasto" });
    console.log(error);
  }
};

const obtenerGastosPorCategoria = async (req, res) => {
  const { id } = req.params;

  try {
    const inicioMes = new Date();
    inicioMes.setDate(1); // Primer día del mes
    inicioMes.setHours(0, 0, 0, 0); // Inicio del día

    const finMes = new Date(
      inicioMes.getFullYear(),
      inicioMes.getMonth() + 1,
      0,
      23,
      59,
      59
    ); // Último día del mes a las 23:59

    // Encuentra todos los gastos para este usuario en el rango de fechas
    const gastos = await Gasto.find({
      usuario: id, // Asegúrate de que el ID sea el correcto y considera convertirlo a ObjectId si es necesario
      fecha: { $gte: inicioMes, $lte: finMes },
    });

    // Agrupar los Gastos por Categoría y Sumar los Importes
    const resultado = gastos.reduce((acc, { nombreCategoria, importe }) => {
      if (!acc[nombreCategoria]) {
        acc[nombreCategoria] = 0;
      }
      acc[nombreCategoria] += parseFloat(importe);
      return acc;
    }, {});

    res.json(resultado);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error al obtener gastos por categoría" });
  }
};
const obtenerGastosAcumuladosPorMes = async (req, res) => {
  const { id } = req.params;

  try {
    // Corrección en el cálculo de inicioMes para asegurar que cubre los últimos 12 meses
    const hoy = new Date();
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth() - 11, 1);

    const gastos = await Gasto.find({
      usuario: id,
      fecha: { $gte: inicioMes },
    });

    // Preparar el objeto resultado con todos los meses inicializados en 0
    const resultado = {};
    for (let i = 0; i < 12; i++) {
      const fecha = new Date(hoy.getFullYear(), hoy.getMonth() - 11 + i, 1);
      const mesAño = fecha.toLocaleString("es-ES", {
        month: "long",
        year: "numeric",
      });
      resultado[`${mesAño.charAt(0).toUpperCase()}${mesAño.slice(1)}`] = 0;
    }

    // Procesar los gastos para acumularlos por mes
    gastos.forEach((gasto) => {
      const mesAño = gasto.fecha.toLocaleString("es-ES", {
        month: "long",
        year: "numeric",
      });
      const clave = `${mesAño.charAt(0).toUpperCase()}${mesAño.slice(1)}`;
      const importe = Number(gasto.importe.replace(",", ".")); // Corrección en la conversión del importe
      if (!isNaN(importe)) {
        // Solo suma si importe es un número válido
        resultado[clave] += importe;
      }
    });

    res.json(resultado);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error al obtener gastos acumulados por mes" });
  }
};

const obtenerResumenDelMes = async (req, res) => {
  const { id } = req.params;
  try {
    const inicioMes = new Date();
    inicioMes.setDate(1);
    inicioMes.setHours(0, 0, 0, 0);

    const finMes = new Date(
      inicioMes.getFullYear(),
      inicioMes.getMonth() + 1,
      0,
      23,
      59,
      59
    );

    // Obtiene gastos e ingresos como antes
    const gastos = await Gasto.find({
      usuario: id,
      fecha: { $gte: inicioMes, $lte: finMes },
      concepto: "gasto",
    });

    const ingresos = await Gasto.find({
      usuario: id,

      fecha: { $gte: inicioMes, $lte: finMes },
      concepto: "ingreso",
    });

    // Calcular el total de gastos
    const totalGastos = gastos.reduce(
      (acc, gasto) => acc + parseFloat(gasto.importe.replace(/,/g, ".")),
      0
    );

    // Calcular el total de ingresos
    const totalIngresos = ingresos.reduce(
      (acc, ingreso) => acc + parseFloat(ingreso.importe.replace(/,/g, ".")),
      0
    );

    // Calcular el saldo
    const saldo = totalIngresos - totalGastos;

    // Formatear los resultados como moneda
    const resultado = {
      ingresos: totalIngresos.toLocaleString("es-AR", {
        style: "currency",
        currency: "ARS",
        minimumFractionDigits: 2,
      }),
      gastos: totalGastos.toLocaleString("es-AR", {
        style: "currency",
        currency: "ARS",
        minimumFractionDigits: 2,
      }),
      saldo: saldo.toLocaleString("es-AR", {
        style: "currency",
        currency: "ARS",
        minimumFractionDigits: 2,
      }),
    };
    console.log(resultado);
    res.json(resultado);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error al obtener el resumen del mes" });
  }
};

const eliminarGasto = async (req, res) => {
  const { id } = req.params;

  try {
    // Encuentra la categoría por su ID y elimínala
    const gasto = await Gasto.findByIdAndDelete(id);

    if (!gasto) {
      return res.status(404).json({ msg: "Movimiento no encontrada" });
    }

    res.json({ msg: "Movimiento eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al eliminar Movimiento" });
  }
};

export {
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
};
