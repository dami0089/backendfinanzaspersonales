import Categoria from "../models/Categoria.js";
import Gasto from "../models/Gasto.js";
import Producto from "../models/Producto.js";
import SubCategoria from "../models/SubCategoria.js";
import SuperMercado from "../models/SuperMercado.js";

const nuevaCategoria = async (req, res) => {
  const categoria = new Categoria(req.body);

  try {
    await categoria.save();
    res.json({ msg: "Categoria guardado correctamente" });
  } catch (error) {
    res.status(500).json({ msg: "Error al grabar Categoria" });
  }
};

const nuevaSubCategoria = async (req, res) => {
  const subCat = new SubCategoria(req.body);

  try {
    const subcatGuardada = await subCat.save();

    // Buscar la categoría correspondiente y agregar la subcategoría al array de subCategorias
    const categoria = await Categoria.findById(subCat.categoria);
    if (!categoria) {
      return res.status(404).json({ msg: "Categoría no encontrada" });
    }

    // Agregar la subcategoría guardada al array de subCategorias
    categoria.subCategorias.push(subcatGuardada._id);

    // Guardar la categoría actualizada
    await categoria.save();

    res.json({ msg: "Sub-Categoría guardada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al grabar Sub-Categoría" });
  }
};

const nuevoGasto = async (req, res) => {
  const gasto = new Gasto(req.body);

  const categoria = await Categoria.findById(gasto.categoria);
  const subCategoria = await SubCategoria.findById(gasto.subCategoria);

  gasto.nombreCategoria = categoria.nombre;
  gasto.nombreSubCategoria = subCategoria.nombreSubCategoria;

  try {
    await gasto.save();
    res.json({ msg: "Gasto guardado correctamente" });
  } catch (error) {
    res.status(500).json({ msg: "Error al grabar gasto" });
  }
};

const obtenerCategorias = async (req, res) => {
  const { id } = req.params;

  try {
    let categorias = await Categoria.find({ usuario: id }).populate({
      path: "subCategorias",
      select: "nombreSubCategoria categoria usuario createdAt updatedAt",
    });

    // Filtrar categorías para excluir las que contienen 'supermercado' o variantes.
    categorias = categorias.filter((categoria) => {
      const nombre = categoria.nombre.toLowerCase();
      return !(
        nombre.includes("supermercado") || nombre.includes("super mercado")
      );
    });

    // Convertir a objetos y formatear (si es necesario)
    const resultado = categorias.map((cat) => {
      const catObj = cat.toObject();

      // Opcional: ajustar el formateo de subCategorias si es necesario
      catObj.subCategorias = catObj.subCategorias.map((sub) => ({
        nombre: sub.nombreSubCategoria,
        id: sub._id,
        // Incluir más campos si es necesario
      }));

      return catObj;
    });

    res.json(resultado);
  } catch (error) {
    console.error(
      "Error al obtener las categorías con sus subcategorías:",
      error
    );
    res.status(500).json({ msg: "Error al obtener categorías" });
  }
};
const obtenerCategoriaMercado = async (req, res) => {
  const { id } = req.params;

  try {
    let categorias = await Categoria.find({ usuario: id }).populate({
      path: "subCategorias",
      select: "nombreSubCategoria categoria usuario createdAt updatedAt",
    });

    // Filtrar categorías para incluir solo las que contienen 'supermercado' o variantes.
    categorias = categorias.filter((categoria) => {
      const nombre = categoria.nombre.toLowerCase();
      return (
        nombre.includes("supermercado") || nombre.includes("super mercado")
      );
    });

    // Convertir a objetos y formatear (si es necesario)
    const resultado = categorias.map((cat) => {
      const catObj = cat.toObject();

      // Opcional: ajustar el formateo de subCategorias si es necesario
      catObj.subCategorias = catObj.subCategorias.map((sub) => ({
        nombre: sub.nombreSubCategoria,
        id: sub._id,
        // Incluir más campos si es necesario
      }));

      return catObj;
    });

    res.json(resultado);
  } catch (error) {
    console.error(
      "Error al obtener las categorías con sus subcategorías específicas:",
      error
    );
    res.status(500).json({ msg: "Error al obtener categorías específicas" });
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

const obtenerSoloCategorias = async (req, res) => {
  const categorias = await Categoria.find();

  res.json(categorias);
};

const editarSubCategoria = async (req, res) => {
  const { id } = req.params;

  const subcategoria = await SubCategoria.findById(id);

  try {
    subcategoria.nombreSubCategoria = req.body.nombre;
    await subcategoria.save();
    res.json({ msg: "Sub Categoria Editada Correctamente" });
  } catch (error) {
    res.status(500).json({ msg: "Error al editar sub categoriaa" });
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

const eliminarSubCategoria = async (req, res) => {
  const { id } = req.params;

  try {
    // Primero, encuentra y elimina la subcategoría especificada
    const subcategoria = await SubCategoria.findByIdAndDelete(id);

    // Si la subcategoría no existe, devuelve un error
    if (!subcategoria) {
      return res.status(404).json({ msg: "Sub Categoría no encontrada" });
    }

    // Luego, encuentra la categoría asociada a la subcategoría eliminada
    const categoria = await Categoria.findById(subcategoria.categoria);

    // Si la categoría existe, elimina la referencia a la subcategoría eliminada
    if (categoria) {
      categoria.subCategorias = categoria.subCategorias.filter(
        (subCatId) => subCatId.toString() !== id
      );
      await categoria.save(); // Guarda la categoría con el array de subCategorias actualizado
    }

    res.json({ msg: "Sub Categoría eliminada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al eliminar la sub categoría" });
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
      concepto: "gasto",
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

const nuevoSupermercado = async (req, res) => {
  const superM = new SuperMercado(req.body);

  try {
    await superM.save();
    res.json({ msg: "Supermercado guardado correctamente" });
  } catch (error) {
    res.status(500).json({ msg: "Error al grabar Supermercado" });
  }
};

const obtenerSupermercados = async (req, res) => {
  const { id } = req.params;
  try {
    // Ordena por '_id' descendente para obtener los más recientes primero
    const supermercados = await SuperMercado.find({ usuario: id }).sort({
      _id: -1,
    }); // Ordena los documentos por '_id' descendente

    res.json(supermercados);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error al obtener gastos" });
  }
};

const obtenerProductosSuperMercado = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    // Ordena por '_id' descendente para obtener los más recientes primero
    const productos = await SubCategoria.find({
      usuario: id,
      esMercado: true,
    }).sort({
      _id: -1,
    }); // Ordena los documentos por '_id' descendente
    console.log(productos);
    res.json(productos);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error al obtener gastos" });
  }
};

const nuevoProductoMercado = async (req, res) => {
  const existeProducto = await SubCategoria.findOne({
    nombreSubCategoria: req.body.nombreSubCategoria,
  });
  if (existeProducto) {
    res.status(500).json({ msg: "Ya existe este producto" });
    return;
  }
  try {
    const nombresSupermercado = [/supermercado/i, /super mercado/i];
    let categoria = await Categoria.findOne({
      nombre: { $in: nombresSupermercado },
      usuario: req.body.usuario,
    });

    if (!categoria) {
      categoria = new Categoria({
        nombre: "Supermercado",
        subCat: "Gasto",
        usuario: req.body.usuario,
        // Asegúrate de inicializar subCategorias si es necesario
        subCategorias: [],
      });
      await categoria.save();
    }

    const producto = new SubCategoria({
      ...req.body,
      categoria: categoria._id,
      esMercado: true,
    });

    const productoAlmacenado = await producto.save();

    // Ahora, actualizamos la categoría para incluir el nuevo producto en subCategorias
    await Categoria.findByIdAndUpdate(categoria._id, {
      $push: { subCategorias: productoAlmacenado._id },
    });

    res.json({ msg: "Producto de mercado guardado correctamente" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error al grabar producto de mercado" });
  }
};

const nuevoGastoSupermercado = async (req, res) => {
  try {
    // Crear el gasto provisionalmente sin productos
    const nombresSupermercado = [/supermercado/i, /super mercado/i];
    let categoria = await Categoria.findOne({
      nombre: { $in: nombresSupermercado },
      usuario: req.body.usuario,
    });

    if (!categoria) {
      categoria = new Categoria({
        nombre: "Supermercado",
        usuario: req.body.usuario,
        subCategorias: [],
      });
      await categoria.save();
    }

    let nombreSuper = "";
    if (req.body.supermercado) {
      const supermercado = await SuperMercado.findById(req.body.supermercado);
      nombreSuper = supermercado.nombre;
    }

    const gastoProvisional = new Gasto({
      fecha: req.body.fecha,
      concepto: "gasto",
      nombreCategoria: categoria.nombre,
      nombreSupermercado: nombreSuper,
      supermercado: true,
      categoria: categoria._id,
      usuario: req.body.usuario,
      productos: [], // Inicialmente vacío
      supermercadoId: req.body.supermercado || "",
      importe: req.body.importe,
    });

    await gastoProvisional.save();

    // Crear productos y asignar el ID del gasto a cada uno
    const productoIds = await Promise.all(
      req.body.productos.map(async (producto) => {
        const nuevoProducto = new Producto({
          fecha: req.body.fecha,
          nombreProducto: producto.nombreSubCategoria,
          cantidad: producto.cantidad,
          importeUnitario: producto.unitario,
          importe: producto.importe,
          subCategoria: producto._id,
          usuario: req.body.usuario,
          gasto: gastoProvisional._id, // Asignar el ID del gasto al producto
        });

        await nuevoProducto.save();
        return nuevoProducto._id;
      })
    );

    // Actualizar el gasto con los IDs de los productos creados
    gastoProvisional.productos = productoIds;
    await gastoProvisional.save();

    res.json({
      msg: "Gasto de supermercado y productos guardados correctamente",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "Hubo un error al guardar el gasto de supermercado y los productos",
    });
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
};
