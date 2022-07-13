const Company = require("../models/company");
const Account = require("../models/account");
const Comment = require("../models/comment");
class SiteControllers {
  // [GET] /admin/:slug
  admin(req, res, next) {
    let page = req.query.page;
    if (!req.query.page) {
      page = 1;
    }
    const size = 15;
    const limit = size;
    const skip = (page - 1) * size;

    Promise.all([
      Company.count({}),
      Company.find({}).lean().skip(skip).limit(limit),
    ]).then(([total, company]) => {
      let totalPage = Math.ceil(total / size);
      let arrtotalPage = [];
      for (let i = 1; i < totalPage + 1; i++) {
        arrtotalPage.push(i);
      }

      company.forEach((e) => {
        e.totalLike = e.like.length - 1;
        if (e.totalLike <= 0) {
          e.totalLike = 0;
        }
      });
      
      res.render("admin", {
        company,
        total,
        arrtotalPage,
      });
    });
  }

  // [GET] /
  home(req, res, next) {
    Company.find({})
      .lean()
      .skip(0)
      .limit(10)
      .then((company) => {
        company.forEach((e) => {
          e.totalLike = e.like.length - 1;
          if (e.totalLike <= 0) {
            e.totalLike = 0;
          }
        });
        let admin = req.cookies.admin;
        var homeActive = "active"

        res.render("home", {
          company,
          homeActive,
          admin,
        });
      })
      .catch(next);
  }

  // [GET] /home/companies
  homeCompanies(req, res, next) {
    let page = req.query.page;
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
      let totalPage = Math.ceil(total / size);
      let arrtotalPage = [];
      for (let i = 1; i < totalPage + 1; i++) {
        arrtotalPage.push(i);
      }

      company.forEach((e) => {
        e.totalLike = e.like.length - 1;
        if (e.totalLike <= 0) {
          e.totalLike = 0;
        }
      });

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
      .sort({ countLike: -1 })
      .then((company) => {
        var companyes = company.map((e) => {
          e.likeCount = e.like.length - 1;
          return e;
        });

        var rankActive = "active"
        var admin = req.cookies.admin;
        res.render("rank", {
          companyes,
          rankActive,
          admin,
        });
      });
  }

  // [GET] /login
  login(req, res, next) {
    res.render("login", { layout: false });
  }

  // [post] /login
  postLogin(req, res, next) {
    let company = Company.find({}).lean().skip(0).limit(10);
    let user = Account.findOne({ email: req.body.email }).lean();

    Promise.all([user, company])
      .then(async ([user, company]) => {
        // console.log(user)
        // console.log(company)

        company.forEach((e) => {
          e.totalLike = e.like.length - 1;
          if (e.totalLike <= 0) {
            e.totalLike = 0;
          }
        });

        if (!user) {
          res.render("login", {
            err: "Tài khoản này không tồn tại",
            layout: false,
          });
          return;
        }

        if (user.password != req.body.password) {
          res.render("login", { err: "Mật Khẩu Không Đúng", layout: false });
          return;
        }

        if (user.admin == true) {
          res.cookie("userId ", user._id);
          res.cookie("admin ", user.admin);
        }
        res.cookie("userId ", user._id);
        res.redirect(`/`);
      })
      .catch(next);
  }

  // [GET] /register
  register(req, res, next) {
    res.render("register", { layout: false });
  }

  // [GET] /contact
  contact(req, res, next) {
    var contactActive = "active"
    let admin = req.cookies.admin;
    res.render("contact", { admin, contactActive });
  }

  // [PUT] /profile/update/:slug
  updateProfile(req, res, next) {
    const file = req.file;
    // Kiểm tra nếu không phải dạng file thì báo lỗi
    if (!file) {
      const error = new Error("Upload file again!");
      error.httpStatusCode = 400;
      return next(error);
    }
    // file đã được lưu vào thư mục uploads
    // gọi tên file: req.file.filename và render ra màn hìnhe
    const accountUpdate = {
      avatar: req.file.filename,
      ...req.body,
    };

    Account.updateOne({ slug: req.params.slug }, accountUpdate)
      .then(() => res.redirect("back"))
      .catch(next);
  }

  // [post] /register
  postRegister(req, res, next) {
    let newAccount = new Account(req.body);
    newAccount.save().then(() => {
      res.redirect("/login");
    });
  }

  // [post] /like/company/:slug
  likeCompany(req, res, next) {
    Company.updateMany(
      { _id: req.params.id },
      {
        $addToSet: { like: req.query.idUser },
      },
      {
        $inc: { countLike:  1},
      }

    ).then(() => {
      res.redirect("back");
    });
  }
  // [post] /unlike/company/:slug

  unLikeCompany(req, res, next) {
    Company.updateMany(
      { _id: req.params.id },
      {
        $pull: { like: req.query.idUser },
      },
      {
        $inc: { countLike: - 1},
      }
    ).then(() => {
      res.redirect("back");
    });
  }

  // [GET] /profile/:slug
  profile(req, res, next) {
    const user = Account.findOne({ slug: req.params.slug });
    const company = Company.find({ author: req.cookies.userId });
    Promise.all([user, company]).then(async ([user, company]) => {
      let avatar = user.avatar;
      let userName = user.userName;
      let slug = user.slug;
      let countLike = company.reduce((tatol, company) => {
        return tatol + (company.like.length - 1);
      }, 0);
      let countPost = company.length;
      res.render("profile", { avatar, userName, slug, countLike, countPost });
    });
  }

  //[get] /logout
  logout(req, res, next) {
    res.clearCookie("userId");
    res.clearCookie("companyId");
    res.clearCookie("admin");
    res.redirect("/");
  }

  // [GET] /detail/:slug
  detail(req, res, next) {
    Company.findOne({ slug: req.params.slug })
      .lean()
      .then((company) => {
        res.cookie("idCompany", company._id);
        return company;
      })
      .then((company) => {
        let idUser = req.cookies.userId;
        let img1 = company.albums[0].filename;
        let img2 = company.albums[1].filename;
        let img3 = company.albums[2].filename;
        let fillterComment = [];
        let massage = Comment.find({ idCompany: company._id })
          .lean()
          .sort({ createdAt: -1 });
        let countComment = Comment.find({ idCompany: company._id }).count({});
        let user = Account.find({}).lean();
        let me = Account.find({ _id: idUser }).lean();
        Promise.all([massage, user, countComment, me]).then(
          ([massage, user, countComment, me]) => {
            massage.map((massageCurrent) => {
              user.find((useCurrent) => {
                if (massageCurrent.idUser == useCurrent._id) {
                  let infoMass = Object.assign(massageCurrent, useCurrent);
                  fillterComment.push(infoMass);
                }
              });
            });

            fillterComment.forEach((e) => {
              let time = `${e.createdAt.getDay()}/${e.createdAt.getMonth()}/${e.createdAt.getFullYear()}`;
              e.createdAt = time;
            });
            let myAvatar = me.avatar;
            let avatar = fillterComment.avatar;

            let totalLike = company.like.length - 1;
            if (totalLike <= 0) {
              totalLike = 0;
            }
            let isLike;
            if (company.like.includes(req.cookies.userId)) {
              isLike = true;
            } else {
              isLike = false;
            }
            res.render("detail", {
              isLike,
              company,
              totalLike,
              idUser,
              img1,
              img2,
              img3,
              me,
              myAvatar,
              avatar,
              fillterComment,
              countComment,
            });
          }
        );
        if (!req.cookies.idCompany) {
          res.render("err", { layout: false });
        }
      })
      .catch(next);
  }

  // [GET] /
  sortField(req, res, next) {
    let page = req.query.page;
    if (!req.query.page) {
      page = 1;
    }
    const size = 8;
    const limit = size;
    const skip = (page - 1) * size;

    Promise.all([
      Company.count({ field: req.params.field }),
      Company.find({ field: req.params.field }).lean().skip(skip).limit(limit),
    ]).then(([total, company]) => {
      let totalPage = Math.ceil(total / size);
      let arrtotalPage = [];
      for (let i = 1; i < totalPage + 1; i++) {
        arrtotalPage.push(i);
      }

      var sortFieldActive = "active"
      let admin = req.cookies.admin;
      res.render("homeCompanies", {
        company,
        total,
        admin,
        arrtotalPage,
        sortFieldActive
      });
    });
  }

  search(req, res, next) {
    let page = req.query.page;
    if (!req.query.page) {
      page = 1;
    }
    const size = 8;
    const limit = size;
    const skip = (page - 1) * size;

    Promise.all([
      Company.count({ name: req.query.name.toUpperCase() }),
      Company.find({ name: req.query.name.toUpperCase() })
        .lean()
        .skip(skip)
        .limit(limit),
    ]).then(([total, company]) => {
      let totalPage = Math.ceil(total / size);
      let arrtotalPage = [];
      for (let i = 1; i < totalPage + 1; i++) {
        arrtotalPage.push(i);
      }
      res.render("homeCompanies", {
        company,
        total,
        arrtotalPage,
      });
    });
  }

  stored(req, res, next) {
    Company.find({ author: req.params.slug })
      .lean()
      .then((company) => {
        res.render("stored", { company });
      });
  }
  deleteCompany(req, res, next) {
    Company.deleteOne({ slug: req.params.slug }).then(() => {
      res.redirect("back");
    });
  }
  updateCompany(req, res, next) {
    Company.findOne({ slug: req.params.slug })
      .lean()
      .then((company) => {
        res.render("updateCompany", { company });
      });
  }
  PostUpdateCompany() {}
}

module.exports = new SiteControllers();
