const Company = require("../models/company");
const Comment = require("../models/comment");
const Account = require("../models/account");

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
      const error = new Error("Upload file again!");
      error.httpStatusCode = 400;
      return next(error);
    }
    // file đã được lưu vào thư mục uploads
    // gọi tên file: req.file.filename và render ra màn hình
    var logoCompany = req.file.filename;

    var newCompanyData = new Company(req.body);
    newCompanyData.logo = logoCompany;
    // console.log(newCompanyData)
    newCompanyData
      .save()
      .then(() => res.redirect("/home/companies"))
      .catch(next);
  }

  // [POST] /create/comment
  postComment(req, res, next) {
    console.log(req.body);

    Comment.aggregate([
      {
        $lookup: {
          from: Lop.collection.name,
          localField: "maLop",
          foreignField: "_id",
          as: "lop",
        },
      },
      {
        $replaceRoot: {
          newRoot: { $mergeObjects: [{ $arrayElemAt: ["$lop", 0] }, "$$ROOT"] },
        },
      },
      {
        $lookup: {
          from: Khoa.collection.name,
          localField: "maKhoa",
          foreignField: "_id",
          as: "khoa",
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [{ $arrayElemAt: ["$khoa", 0] }, "$$ROOT"],
          },
        },
      },
      {
        $group: {
          _id: "$maKhoa",
          tenKhoa: { $first: "$tenKhoa" },
          SLSinhVien: { $sum: 1 },
        },
      },
    ]);

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
