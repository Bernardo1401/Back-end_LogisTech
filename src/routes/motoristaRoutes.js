const express = require("express");
const router = express.Router();
const motoristaController = require("../controllers/motoristaController.js");


router.get("/usuarios/motoristas", motoristaController.getAllMotoristas);
router.get("/usuarios/motoristas/:id", motoristaController.getMotoristaById);
router.post("/usuarios/motoristas", motoristaController.createMotorista);
router.put("/usuarios/motoristas/:id", motoristaController.updateMotorista);
router.delete("/usuarios/motoristas/:id", motoristaController.deleteMotorista);

module.exports = router;