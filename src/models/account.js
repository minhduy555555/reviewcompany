const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-generator');
mongoose.plugin(slug);

const account = new Schema({
  userName: { type: String },
  password : { type: String },
  avatar:{ type: String, default: "1657773024304-617195996-avatar-df.jpg" },
  email:{type:String,unique: true},
  admin:{type: Boolean, default: false},
  slug: { type: String, slug: "userName", unique: true }
},{
  timestamps:true,
});

module.exports = mongoose.model('accounts', account);
