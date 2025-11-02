require('dotenv').config();
const mongoose = require('mongoose');

const url = process.env.DB_URL;
console.log("Loaded DB_URL:", url);

if (!url) {
    console.error(" Database URL is not defined in environment variables");
    process.exit(1);
}

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("Connected to MongoDB!"))
    .catch((err) => console.error(" MongoDB connection error:", err.message));


const findAllRecord = async (schema) => {
    const dbRes = await schema.find();
    return dbRes;
}

const createNewRecord = async (data, schema) => {
    const dbRes = await new schema(data).save();
    return dbRes;
}

const updateRecord = async (id, data, schema) => {
    const dbRes = await schema.findByIdAndUpdate(id, data, { new: true });
    return dbRes;
}

const deleteRecord = async (id, schema) => {
    const dbRes = await schema.findByIdAndDelete(id);
    return dbRes;
}

module.exports = {
    findAllRecord,
    createNewRecord,
    updateRecord,
    deleteRecord
}