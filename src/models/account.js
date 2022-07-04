const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-generator');
mongoose.plugin(slug);

const account = new Schema({
  userName: { type: String },
  password : { type: String },
  avatar:{ type: String, default:'https://scontent.fdad3-6.fna.fbcdn.net/v/t1.30497-1/143086968_2856368904622192_1959732218791162458_n.png?_nc_cat=1&ccb=1-7&_nc_sid=7206a8&_nc_ohc=GkV1pgR-JMkAX_Q1ins&_nc_ht=scontent.fdad3-6.fna&oh=00_AT-PLiuZkWuNJsGUljbDGq9RD9ye7Ne1A3KWWfhqKBITcQ&oe=62EA1BF8' },
  email:{type:String,unique: true},
  slug: { type: String, slug: "userName", unique: true }
},{
  timestamps:true,
});

module.exports = mongoose.model('accounts', account);
