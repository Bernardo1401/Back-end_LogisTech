const express = require("express");
const router = express.Router();
const veiculoController = require("../controllers/veiculoController.js"); // Alterado

// Rotas para Veículos
router.get("/veiculos", veiculoController.getAllVeiculos);
router.get("/veiculos/:id", veiculoController.getVeiculoById);
router.post("/veiculos", veiculoController.createVeiculo);
router.put("/veiculos/:id", veiculoController.updateVeiculo);
router.delete("/veiculos/:id", veiculoController.deleteVeiculo);

module.exports = router;