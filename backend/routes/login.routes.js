const express = require("express");
const router = express.Router();
const loginController = require("../controller/login.controller");
const userSchema = require("../model/users.model");

router.post("/",(req,res)=>{
    loginController.loginFunc(req,res,userSchema);
});

module.exports = router;