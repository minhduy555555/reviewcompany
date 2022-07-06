const Company = require("../models/company");
const Account = require("../models/account");
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
      .catch(next);
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
      .sort({ like: "desc" })
      .then((company) => {
        res.render("rank", {
          company,
        });
      });
  }

  // [GET] /login
  login(req, res, next) {
    res.render("login", { layout: false });
  }

  // [post] /login
  postLogin(req, res, next) {
    Account.findOne({ email: req.body.email })
      .lean()
      .then((user) => {
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
        res.cookie("userId ", user._id);
        res.redirect("/");
      });
  }

  // [GET] /register
  register(req, res, next) {
    res.render("register", { layout: false });
  }

  // [post] /register
  postRegister(req, res, next) {
    var newAccount = new Account(req.body);
    newAccount.save().then(() => {
      res.redirect("/login");
    });
  }
  //[get] /logout
  logout(req, res, next) {
    res.clearCookie("userId");
    res.clearCookie("companyId");
    res.redirect("/");
  }

  // [GET] /detail/:slug
  detail(req, res, next) {

    // Comment =Comment.find({idCompany :})
    Company.findOne({ slug: req.params.slug })
      .lean()
      .then((company) => {
        res.cookie("idCompany", company._id);
        var idUser =  req.cookies.userId
        if (req.cookies.idCompany) {
          res.render("detail", { company, idUser});
        } 
         else {
          res.render("err", { layout: false });
        }
      })
      .catch(() => {
        res.render("err", { layout: false });
      })
  }

  // Comment.find()
}

module.exports = new SiteControllers();
