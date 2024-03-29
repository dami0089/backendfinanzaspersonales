import mongoose from "mongoose";

const categoriaSchema = mongoose.Schema(
  {
    nombre: {
      type: String,
      trim: true,
    },
    subCat: {
      type: String,
      trim: true,
    },
    subCategorias: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubCategoria",
      },
    ],
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
    },
  },
  {
    timestamps: true,
  }
);

const Categoria = mongoose.model("Categoria", categoriaSchema);

export default Categoria;
