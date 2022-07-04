const Company = require("../models/company");

class CreateControllers {
  // [GET] /create/form/company
  createCompany(req, res, next) {
    res.render("createCompany")
  }

  // [POST] /create/post/company
  postCompany(req, res, next) {
    var logoToUrl = req.body.logo
    console.log(URL.createObjectURL(logoToUrl[0]))

    var newCompanyData = new Company(req.body)
    newCompanyData
      .save()
      .then(() => res.redirect("/home/companies"))
      .catch(next);
  }

}

module.exports = new CreateControllers();
