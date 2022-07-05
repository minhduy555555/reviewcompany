const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const comment = new Schema({
    idUser: { type: String },
    idCompany : { type: String },
    message : { type: String },
    like: {type: Number, default: 0}
}, {
    timestamps: true,
})

module.exports = mongoose.model('comments', comment);

