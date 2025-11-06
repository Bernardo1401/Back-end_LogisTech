const express = require("express");
const router = express.Router();
const pedidosController = require("../controllers/pedidocontroller"); 


router.get("/pedidos", pedidosController.getAllPedidos);
router.get("/pedidos/:id", pedidosController.getPedidoById);
router.post("/pedidos", pedidosController.createPedido);
router.put("/pedidos/:id", pedidosController.updatePedido);
router.delete("/pedidos/:id", pedidosController.deletePedido);

module.exports = router;