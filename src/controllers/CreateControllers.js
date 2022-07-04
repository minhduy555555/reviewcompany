const Company = require("../models/company");
const multipleUploadMiddleware = require("../middlewares/multipleUploadMiddleware");

class CreateControllers {
  // [GET] /create/form/company
  createCompany(req, res, next) {
    res.render("createCompany");
  }

  // [POST] /create/post/company
  postCompany(req, res, next, multipleUploadMiddleware) {
    let debug = console.log.bind(console);

    var newCompanyData = new Company(req.body);
    newCompanyData
      .then(multipleUploadMiddleware(req, res))
      .save()
      .then(() => res.redirect("/home/companies"))
      .catch(next);
  }
}

module.exports = new CreateControllers();
