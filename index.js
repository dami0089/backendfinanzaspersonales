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

// app.use(
//   cors({
//     origin: "https://finper.netlify.app",
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/api2/gastos", gastosRoutes);
app.use("/api2/usuarios", usuariosRoutes);

app.listen(4001, () => {
  console.log("Ejecutando en el puerto 4001");
});
