import mongoose from "mongoose";

const superMercadoSchema = mongoose.Schema(
  {
    nombre: {
      type: String,
      trim: true,
    },
    direccion: {
      type: String,
      trim: true,
    },
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
    },
  },
  {
    timestamps: true,
  }
);

const SuperMercado = mongoose.model("SuperMercado", superMercadoSchema);

export default SuperMercado;
