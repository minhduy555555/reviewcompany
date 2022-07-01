const express = require('express')
const morgan = require('morgan')
const app = express()
const path = require('path')
const { engine } = require('express-handlebars')
const port = 3000

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

app.get('/', (req, res) => {
  res.render("home")
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})