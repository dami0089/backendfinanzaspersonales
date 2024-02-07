import mongoose from "mongoose";

const gastosSchema = mongoose.Schema({
  fecha: {
    type: Date,
  },
  concepto: {
    type: String,
    trim: true,
  },
  descripcion: {
    type: String,
  },
  nombreCategoria: {
    type: String,
  },
  nombreSupermercado: {
    type: String,
  },
  nombreSubCategoria: {
    type: String,
  },
  supermercado: {
    type: Boolean,
    default: false,
  },
  categoria: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Categoria",
  },
  subCategoria: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SubCategoria",
  },
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
  },
  productos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Producto",
    },
  ],
  supercadoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SuperMercado",
  },
  importe: {
    type: String,
  },
});

const Gasto = mongoose.model("Gasto", gastosSchema);

export default Gasto;
