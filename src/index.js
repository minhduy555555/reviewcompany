const express = require('express')
const morgan = require('morgan')
const app = express()
const path = require('path')
const { engine } = require('express-handlebars')
const route = require("./router")
const port = 3001

// app.use(morgan('combined'))

app.use(express.static(path.join(__dirname,'public')))
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