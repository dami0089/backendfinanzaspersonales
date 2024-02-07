import mongoose from "mongoose";

const subCategoriaSchema = mongoose.Schema(
  {
    nombreSubCategoria: {
      type: String,
      trim: true,
    },
    esMercado: {
      type: Boolean,
      default: false,
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
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const SubCategoria = mongoose.model("SubCategoria", subCategoriaSchema);

export default SubCategoria;
