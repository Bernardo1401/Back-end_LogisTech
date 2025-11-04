require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

// Importar todas as rotas do projeto LogisTech
const adminRoutes = require("./src/routes/adminRoutes");
const userRoutes = require("./src/routes/userRoutes");
const motoristaRoutes = require("./src/routes/motoristaRoutes");
const veiculoRoutes = require("./src/routes/veiculoRoutes");
const pedidoRoutes = require("./src/routes/pedidoRoutes");
const entregaRoutes = require("./src/routes/entregaRoutes");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Configurar rotas da API
app.use("/api", adminRoutes);
app.use("/api", userRoutes);
app.use("/api", motoristaRoutes);
app.use("/api", veiculoRoutes);
app.use("/api", pedidoRoutes);
app.use("/api", entregaRoutes);

// Rota de teste
app.get("/", (req, res) => {
    res.json({ 
        message: "API LogisTech funcionando!", 
        version: "1.0.0",
        endpoints: {
            admins: "/api/usuarios/admins",
            users: "/api/usuarios",
            motoristas: "/api/usuarios/motoristas",
            veiculos: "/api/veiculos",
            pedidos: "/api/pedidos",
            entregas: "/api/entregas"
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor LogisTech rodando em http://localhost:${PORT}`);
});