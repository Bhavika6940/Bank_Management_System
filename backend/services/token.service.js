require("dotenv").config();
const jwt = require("jsonwebtoken");

const verifyToken = async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return {
            message: "No token provided!",
            isVerified: false,
        };
    }
    const token = authHeader.split(" ")[1];
    console.log(token);
    if (!token) {
        return {
            message: "There is no token!",
            isVerified: false
        }
    }
    try {
        const decoded = await jwt.verify(
            token,
            process.env.JWT_TOKEN
        );
        return {
            message: "Token verified !",
            isVerified: true,
            data: decoded
        }

    }
    catch (err) {
        return {
            message: err.message,
            isVerified: false,

        }

    }
}

module.exports = { verifyToken };