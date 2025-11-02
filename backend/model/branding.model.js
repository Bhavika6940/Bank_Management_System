const mongo = require('mongoose');
const {Schema} = mongo;

const brandingSchema = new Schema({
    bankName : String,
    bankTagline : String,
    bankLogo : String,
    bankAccountNo : String,
    bankTransactionId : String,
    bankAddress : String,
    adminFullname : String,
    adminEmail : String,
    adminPassword : String,
    bankLinkedIn : String,
    bankTwitter : String,
    bankFacebook : String,
    bankDescription : String
},{timestamps : true});

module.exports = mongo.model("branding",brandingSchema);