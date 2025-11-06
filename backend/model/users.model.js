const mongo = require("mongoose");
const { Schema } = mongo;
const bcrypt = require("bcrypt");
const userSchema = new Schema({
    fullname: String,
    userType: String,
    mobile: String,
    email: {
        type: String,
        unique: true
    },
    key: String,
    password: String,
    profile: String,
    address: String,
    branch: String,
    userType: String,
    isActive: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });
userSchema.pre("save", async function (next) {
    const user = this;
    user.email = user.email.toLowerCase();
    next();
})
userSchema.pre("save", async function (next) {
    const user = this;
    if (!user.isModified("password")) return next();

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
})


module.exports = mongo.model("user", userSchema);