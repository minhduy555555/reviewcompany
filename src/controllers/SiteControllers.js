const Company = require("../models/company")

class SiteControllers {
    // [GET] /
    home(req, res, next) {
        Company.find({}).lean()
            .then(company => {
                console.log(company)
                res.render("home", {
                    company
                })
            })
    }
}

module.exports = new SiteControllers();
