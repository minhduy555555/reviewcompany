const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-generator');
mongoose.plugin(slug);

const company = new Schema({
  name: { type: String, uppercase: true},
  logo: { type: String },
  slogan: { type: String },
  field: { type: String },
  address: { type: String },
  like: { type: Array, default: [""]},
  countLike: { type: Number, default: 0 },
  view: { type: Number, default: 0 },
  albums: { type: Array },
  author: {type: String },
  description: { type: String },
  founding: { type: Date, default: Date.now},
  typeCompany: { type: String },
  slug: { type: String, slug: "name", unique: true }
});

module.exports = mongoose.model('companies', company); 
