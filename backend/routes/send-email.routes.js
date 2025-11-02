const express = require("express");
const router = express.Router();


emailController = require("../controller/email.controller");
router.post("/", (req, res) => {
    emailController.sendEmail(req, res);
});

module.exports = router;