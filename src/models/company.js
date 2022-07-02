const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const company = new Schema({
  name: { type: String },
  logo: { type: String },
  slogan: { type: String },
  field: { type: String },
  address: { type: String },
  like: { type: Number, default: 0 },
  comment: { type: Number, default: 0 },
  albums: { type: Array },
  description: { type: String },

});

module.exports = mongoose.model('Companies', company);
