const Company = require("../models/company");
const Comment = require("../models/comment");
const Account = require("../models/account");

class CreateControllers {
  // [GET] /create/form/company
  createCompany(req, res, next) {
    var admin = req.cookies.admin
    var createCpnActive = "active"
    res.render("createCompany", {admin, createCpnActive});
  }

  // [POST] /create/post/company
  postCompany(req, res, next) {

    //nhận dữ liệu từ form mảng thông số của các file upload
    const files = req.files;
    // Kiểm tra nếu không phải dạng file thì báo lỗi
    if (!files) {
        const error = new Error('Upload files again')
        error.httpStatusCode = 400
        return next(error)
      }
    
    // files đã được lưu vào thư mục uploads
    // hiển thị thông số các ảnh ra màn hình
    // console.log(files)

    var newCompanyData = new Company(req.body);
    newCompanyData.logo = files[0].filename
    newCompanyData.albums = files
    // console.log(newCompanyData)
    newCompanyData
      .save()
      .then(() => res.redirect(`/detail/${newCompanyData.slug}`))
      .catch(next)
  }

  // [POST] /create/comment
  postComment(req, res, next) {
    // console.log(req.body);

    var result =  Comment.aggregate([
      {
        $lookup: {
          from: Account,
          localField: "idUser",
          foreignField: "_id",
          as: "account",
        },
      },
      {
        $replaceRoot: {
          newRoot: { $mergeObjects: [{ $arrayElemAt: ["$account", 0] }, "$$ROOT"] },
        },
      },
      {
        $lookup: {
          from: Company,
          localField: "idCompany",
          foreignField: "_id",
          as: "company",
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [{ $arrayElemAt: ["$company", 0] }, "$$ROOT"],
          },
        },
      },
      {
        $group: {
          _id: "$_id",
          idUser: "$idUser",
          idCompany: "$idCompany",
        },
      },
    ]);

    // console.log('result' , result)

    let newCommentData = new Comment(req.body);
    newCommentData
      .save()
      .then(() => {
        res.redirect("back");
      })
      .catch(next);
  }
}

module.exports = new CreateControllers();
