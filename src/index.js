const express = require('express')
const morgan = require('morgan')
const path = require('path')
var cookieParser = require('cookie-parser')
const bodyParser= require('body-parser')
const multer = require('multer');
var middlewares = require('./middlewares/authent')
const { engine } = require('express-handlebars')
const route = require("./routes")
const database = require("./config/database")

database.connect()
const app = express()
const port = 3000

// app.use(morgan('combined'))
// Cho phép lý dữ liệu từ form method POST
app.use(express.urlencoded({extended: true}))

//CREATE EXPRESS APP
app.use(bodyParser.urlencoded({extended: true}))

app.use(cookieParser())

app.use('/',middlewares.getUserAndAvt)
app.use(express.static(path.join(__dirname, 'public')));
// cấu hình hbs
app.engine('hbs', engine({
  extname: '.hbs',
  helpers: {
    sum: (a,b) => a+b, 
  }
}
));
app.set("view engine", "hbs")
app.set('views', path.join(__dirname, 'resource','views'));

route(app)

app.listen(port, () => {
  console.log(`app đang chạy trên cổng ${port}`)
})