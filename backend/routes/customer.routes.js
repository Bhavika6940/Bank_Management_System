const express = require("express");
const router = express.Router();
const controller = require("../controller/controller");
const customerSchema = require("../model/customer.model");
const { verifyToken } = require("../middlewares/middleware");

router.post("/", (req, res) => {
    controller.createData(req, res, customerSchema);
});
router.get("/", verifyToken, (req, res) => {
    controller.getAllData(req, res, customerSchema);
});
router.put("/:id", (req, res) => {
    controller.updateData(req, res, customerSchema);
});
router.delete("/:id", (req, res) => {
    controller.deleteData(req, res, customerSchema);
})

module.exports = router;