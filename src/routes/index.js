const createRouter =  require("./create")
const siteRouter = require('./site')
function route(app) {
// chú ý route đi từ trên xuống dưới. nó match trúng thằng nào thì sẽ render ra thằng đó đầu tiên
    app.use("/create", createRouter)
    app.use('/', siteRouter)
    app.use('*', (req, res, next) => {
        res.render("err", {layout: false})
    })
}
  
module.exports = route