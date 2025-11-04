const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController.js");


router.get("/usuarios/admins", adminController.getAllAdmins);
router.get("/usuarios/admins/:id", adminController.getAdminById);
router.post("/usuarios/admins", adminController.createAdmin);
router.put("/usuarios/admins/:id", adminController.updateAdmin);
router.delete("/usuarios/admins/:id", adminController.deleteAdmin);

module.exports = router;