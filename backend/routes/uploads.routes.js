const express = require("express");
const router = express.Router();
const uploadController = require("../controller/upload.controller");
router.post("/", (req, res) => {
    uploadController.uploadFile(req, res)
});

module.exports = router;

