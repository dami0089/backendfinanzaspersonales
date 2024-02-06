import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import conectarDB from "./config/db.js";
import gastosRoutes from "./routes/gastosRoutes.js";
import usuariosRoutes from "./routes/usuariosRoutes.js";

const app = express();
app.use(express.json());

dotenv.config();

conectarDB();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/api/gastos", gastosRoutes);
app.use("/api/usuarios", usuariosRoutes);

app.listen(4000, () => {
  console.log("Ejecutando en el puerto 4000");
});
