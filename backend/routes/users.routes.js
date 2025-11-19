const express = require("express");
const router = express.Router();
const controller = require("../controller/controller");
const userSchema = require("../model/users.model");
const { verifyToken , isAdmin } = require("../middlewares/middleware");

router.post("/", verifyToken, isAdmin, (req, res) => {
    controller.createData(req, res, userSchema);
});
router.get("/", verifyToken, isAdmin, (req, res) => {
    controller.getAllData(req, res, userSchema);
})
router.put("/:id", verifyToken, isAdmin, (req, res) => {
    controller.updateData(req, res, userSchema);
});
router.delete("/:id", verifyToken, isAdmin,(req, res) => {
    controller.deleteData(req, res, userSchema);
})


module.exports = router;