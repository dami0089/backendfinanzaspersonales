import mongoose from "mongoose";

const productosSchema = mongoose.Schema(
  {
    fecha: {
      type: Date,
    },
    nombreProducto: {
      type: String,
    },
    cantidad: {
      type: String,
      trim: true,
    },
    importeUnitario: {
      type: String,
      trim: true,
    },
    importe: {
      type: String,
      trim: true,
    },
    subCategoria: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategoria",
    },
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
    },
    gasto: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gasto",
    },
  },
  {
    timestamps: true,
  }
);

const Producto = mongoose.model("Producto", productosSchema);

export default Producto;
