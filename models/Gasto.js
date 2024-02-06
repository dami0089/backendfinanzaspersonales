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
  categoria: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Categoria",
  },
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
  },
  importe: {
    type: String,
  },
});

const Gasto = mongoose.model("Gasto", gastosSchema);

export default Gasto;
