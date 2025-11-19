const express = require("express");
const router = express.Router();
const controller = require("../controller/controller");
const customerSchema = require("../model/customer.model");

router.post("/", (req, res) => {
    controller.findByAccountNo(req, res, customerSchema)
})

module.exports = router;