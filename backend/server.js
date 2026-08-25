const express = require("express");
const cors = require("cors");

require("dotenv").config();

const productosRouter = require("./routes/productos");
const categoriasRoutes = require("./routes/categorias");
const pedidosRouter = require("./routes/pedidos");
const authRouter = require("./routes/auth");
const pagosRouter = require("./routes/pagos");
const historiasRouter = require("./routes/historias");

const app = express();

const PORT = process.env.PORT || 4000;


// ========================================
// MIDDLEWARES
// ========================================

app.use(cors());

app.use(express.json());


// ========================================
// RUTAS DE LA API
// ========================================

app.use(
  "/api/productos",
  productosRouter
);

app.use(
  "/api/categorias",
  categoriasRoutes
);

app.use(
  "/api/pedidos",
  pedidosRouter
);

app.use(
  "/api/auth",
  authRouter
);

app.use(
  "/api/pagos",
  pagosRouter
);

app.use(
  "/api/historias",
  historiasRouter
);


// ========================================
// RUTA PRINCIPAL
// ========================================

app.get("/", (req, res) => {
  res.json({
    mensaje:
      "API de la Tienda de Plantas funcionando correctamente 🌱",
  });
});


// ========================================
// RUTA DE PRUEBA
// ========================================

app.get("/api/saludo", (req, res) => {
  res.json({
    mensaje:
      "Hola desde nuestra API 🌱",
  });
});


// ========================================
// INICIAR SERVIDOR
// ========================================

app.listen(PORT, () => {
  console.log(
    `Servidor API funcionando en http://localhost:${PORT}`
  );
});