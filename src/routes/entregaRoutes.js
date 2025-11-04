const express = require("express");
const router = express.Router();
const entregaController = require("../controllers/entregaController.js");

router.get("/entregas", entregaController.getAllEntregas);
router.get("/entregas/:id", entregaController.getEntregaById);
router.post("/entregas", entregaController.createEntrega);
router.put("/entregas/:id", entregaController.updateEntrega);
router.delete("/entregas/:id", entregaController.deleteEntrega);

module.exports = router;