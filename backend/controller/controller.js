const dbService = require("../services/db.service")
const createData = async (req, res, schema) => {
    try {
        const data = req.body;
        const dbRes = await dbService.createNewRecord(data, schema);
        res.status(200).json({
            message: "Data created successfully",
            success: true,
            data: dbRes
        })

    }
    catch (error) {
        if (error.code === 11000) {
            return res.status(422).json({
                message: "Already exists!",
                error: error.message,
                success: false
            })
        }
        res.status(500).json({
            message: "Internal server error!",
            error: error.message,
            success: false
        })
    }
}

const getAllData = async (req, res, schema) => {
    try {
        const dbRes = await dbService.findAllRecord(schema);
        res.status(200).json({
            message: "Data fetched successfully",
            data: dbRes
        })
    }
    catch (error) {
        res.status(500).json({
            message: "Internal server error!",
            error: error.message
        })
    }
}

const updateData = async (req, res, schema) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const dbRes = await dbService.updateRecord(id, data, schema);
        res.status(200).json({
            message: "Data updated successfully",
            data: dbRes
        })


    }
    catch (error) {
        res.status(500).json({
            message: "Internal server error!",
            error: error.message
        })
    }
}
const deleteData = async (req, res, schema) => {
    try {
        const id = req.params.id;
        const dbRes = await dbService.deleteRecord(id, schema);
        res.status(200).json({
            message: "Data deleted successfully",
            data: dbRes
        })

    }
    catch (error) {
        res.status(500).json({
            message: "Internal server error!",
            error: error.message
        })
    }
}

module.exports = {
    createData,
    getAllData,
    updateData,
    deleteData
}