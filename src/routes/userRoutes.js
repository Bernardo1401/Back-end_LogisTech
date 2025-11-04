const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController.js");


router.get("/usuarios", userController.getAllUsers);
router.get("/usuarios/:id", userController.getUserById);
router.post("/usuarios", userController.createUser);
router.put("/usuarios/:id", userController.updateUser);
router.delete("/usuarios/:id", userController.deleteUser);

module.exports = router;