const Company = require("../models/company")

class SiteControllers {
    // [GET] /
    home(req, res, next) {
        Company.find({}).lean().skip(0).limit(4)
            .then(company => {
                // console.log(company)
                res.render("home", {
                    company
                })
            })
    }

    // [GET] /home/companies
    homeCompanies(req, res, next) {
        Company.find({}).lean()
            .then(company => {
                res.render("homeCompanies", {
                    company
                })
            })
    }
}

module.exports = new SiteControllers();
