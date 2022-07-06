const Company = require("../models/company");
class CreateControllers {
  // [GET] /create/form/company
  createCompany(req, res, next) {
    res.render("createCompany");
  }





  // [POST] /create/post/company
  postCompany(req, res, next) {
    const file = req.file;
    // Kiểm tra nếu không phải dạng file thì báo lỗi
    if (!file) {
        const error = new Error('Upload file again!')
        error.httpStatusCode = 400
        return next(error)
      }
    // file đã được lưu vào thư mục uploads
    // gọi tên file: req.file.filename và render ra màn hình
     var logoCompany = req.file.filename

    var newCompanyData = new Company(req.body)
    newCompanyData.logo = logoCompany
    // console.log(newCompanyData)
    newCompanyData
      .save()
      .then(() => res.redirect("/home/companies"))
      .catch(next);
  }
}

module.exports = new CreateControllers();
