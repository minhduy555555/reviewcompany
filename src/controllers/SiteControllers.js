const Company = require("../models/company");

class SiteControllers {
  // [GET] /
  home(req, res, next) {
    Company.find({})
      .lean()
      .skip(0)
      .limit(10)
      .then((company) => {
        // console.log(company)
        res.render("home", {
          company,
        });
      })
      .catch(next)
  }

  // [GET] /home/companies
  homeCompanies(req, res, next) {
    var page = req.query.page;
    if (!req.query.page) {
      page = 1;
    }
    const size = 8;
    const limit = size;
    const skip = (page - 1) * size;

    Promise.all([
      Company.count({}),
      Company.find({}).lean().skip(skip).limit(limit),
    ]).then(([total, company]) => {
      var totalPage = Math.ceil(total / size);
      var arrtotalPage = [];
      for (var i = 1; i < totalPage + 1; i++) {
        arrtotalPage.push(i);
      }
      res.render("homeCompanies", {
        company,
        total,
        arrtotalPage,
      });
    });
  }

  // [GET] /rank
  rankCompanies(req, res, next) {
    Company.find({})
    .lean()
    .limit(10)
    .sort({like: "desc"})
      .then((company) => {
        res.render("rank", {
          company,
        });
      });
  }
}

module.exports = new SiteControllers();
