const express = require("express");
const router = express.Router();
// 1. Importar o controller de pedidos
const pedidosController = require("../controllers/PedidosController"); // Ajuste o caminho se necessário

// 2. Definir as rotas para /pedidos
router.get("/pedidos", pedidosController.getAllPedidos);
router.get("/pedidos/:id", pedidosController.getPedidoById);
router.post("/pedidos", pedidosController.createPedido);
router.put("/pedidos/:id", pedidosController.updatePedido);
router.delete("/pedidos/:id", pedidosController.deletePedido);

module.exports = router;