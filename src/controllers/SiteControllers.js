const Company = require("../models/company");
const Account = require("../models/account");
const Comment = require("../models/comment");
class SiteControllers {

  // [GET] /admin/:slug
  admin(req, res, next) {
    var page = req.query.page;
    if (!req.query.page) {
      page = 1;
    }
    const size = 15;
    const limit = size;
    const skip = (page - 1) * size;

    Promise.all([
      Company.count({}),
      Company.find({}).lean().skip(skip).limit(limit),
    ])
    .then(([total, company]) => {
      var totalPage = Math.ceil(total / size);
      var arrtotalPage = [];
      for (var i = 1; i < totalPage + 1; i++) {
        arrtotalPage.push(i);
      }

      company.forEach((e) => {
        e.totalLike = e.like.length-1
        if(e.totalLike <= 0) {
          e.totalLike = 0
        }
      })

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
          e.totalLike = e.like.length-1
          if(e.totalLike <= 0) {
            e.totalLike = 0
          }
        })
        var admin = req.cookies.admin
        res.render("home", {
          company,
          admin
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
    ])
    .then(([total, company]) => {
      var totalPage = Math.ceil(total / size);
      var arrtotalPage = [];
      for (var i = 1; i < totalPage + 1; i++) {
        arrtotalPage.push(i);
      }

      company.forEach((e) => {
        e.totalLike = e.like.length-1
        if(e.totalLike <= 0) {
          e.totalLike = 0
        }
      })

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
        var admin = req.cookies.admin
        res.render("rank", {
          company,
          admin
        });
      });
  }

  // [GET] /login
  login(req, res, next) {
    res.render("login", { layout: false });
  }

  // [post] /login
  postLogin(req, res, next) {
    var company = Company.find({}).lean().skip(0).limit(10);
    var user = Account.findOne({ email: req.body.email }).lean();

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
        res.cookie("admin ", user.admin);
      }
      res.cookie("userId ", user._id);
      res.redirect(`/`)
    })
    .catch(next)
  }

  // [GET] /register
  register(req, res, next) {
    res.render("register", { layout: false })
  }

  // [GET] /contact
  contact(req, res, next) {
    var admin = req.cookies.admin
    res.render("contact", {admin});
  }

  

  // [PUT] /profile/update/:slug
  updateProfile(req, res, next) {
    const file = req.file;
    // Kiểm tra nếu không phải dạng file thì báo lỗi
    if (!file) {
        const error = new Error('Upload file again!')
        error.httpStatusCode = 400
        return next(error)
      }
    // file đã được lưu vào thư mục uploads
    // gọi tên file: req.file.filename và render ra màn hìnhe
      const  accountUpdate={
        avatar: req.file.filename,
        ...req.body
      }

      Account.updateOne({ slug: req.params.slug }, accountUpdate)
      .then(() => res.redirect("back"))
      .catch(next);
  }

  // [post] /register
  postRegister(req, res, next) {
    var newAccount = new Account(req.body);
    newAccount.save().then(() => {
      res.redirect("/login");
    });
  }

  // [post] /like/company/:slug
  likeCompany(req, res, next) {
    Company.findOneAndUpdate({ _id: req.params.id }, {
      $addToSet: {like: req.query.idUser}
    })
    .then(() => {
      res.redirect("back");
    });
  }
  // [post] /unlike/company/:slug

  unLikeCompany(req,res,next){
    Company.findOneAndUpdate({ _id: req.params.id }, {
      $pull: {like: req.query.idUser}
    })
    .then(() => {
      res.redirect("back");
    });
  }

  // [GET] /profile/:slug 
  profile(req, res, next) {
   const user = Account.findOne({slug: req.params.slug})
   const company = Company.find({author:req.cookies.userId})
   Promise.all([user,company])
      .then(async ([user,company]) => {
        var avatar = user.avatar 
        var userName = user.userName
        var slug = user.slug
        var countLike = company.reduce((tatol,company)=>{
             return   tatol + (company.like.length -1 )
        },0)
        var countPost = company.length
        res.render("profile", { avatar, userName, slug,countLike,countPost});
      })
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
        var idUser = req.cookies.userId;
        var img1 = company.albums[0].filename;
        var img2 = company.albums[1].filename;
        var img3 = company.albums[2].filename;
        var fillterComment = [];
        var massage = Comment.find({ idCompany: company._id })
          .lean()
          .sort({ createdAt: -1 });
        var countComment = Comment.find({ idCompany: company._id }).count({});
        var user = Account.find({}).lean();
        Promise.all([massage, user, countComment])
        .then(
          ([massage, user, countComment]) => {
            massage.map((massageCurrent) => {
              user.find((useCurrent) => {
                if (massageCurrent.idUser == useCurrent._id) {
                  var infoMass = Object.assign(massageCurrent, useCurrent);
                  fillterComment.push(infoMass);
                }
              });
            });

            fillterComment.forEach((e) => {
              var time = `${e.createdAt.getHours()}h/${e.createdAt.getDay()}/${e.createdAt.getMonth()}/${e.createdAt.getFullYear()}` 
              e.createdAt = time
            })
            // console.log(fillterComment)
            
            var totalLike = company.like.length-1
            if(totalLike <= 0) {
              totalLike = 0
            }
             var isLike
                   if(company.like.includes(req.cookies.userId)){
                      isLike = true
                   }else{
                    isLike =false
                   }
            res.render("detail", {
              isLike,
              company,
              totalLike,
              idUser,
              img1,
              img2,
              img3,
              fillterComment,
              countComment,
            });
          }
        );
        if (!req.cookies.idCompany) {
          res.render("err", { layout: false });
        }
      })
      .catch(next)
  }

// [GET] /
  sortField(req, res, next) {
    var page = req.query.page;
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
      var totalPage = Math.ceil(total / size);
      var arrtotalPage = [];
      for (var i = 1; i < totalPage + 1; i++) {
        arrtotalPage.push(i);
      }

      var admin = req.cookies.admin
      res.render("homeCompanies", {
        company,
        total,
        admin,
        arrtotalPage,
      });
    });
  }

  search(req, res, next) {
    var page = req.query.page;
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

  stored(req, res, next) {
    Company.find({author: req.params.slug})
      .lean()
      .then((company) => {
        res.render("stored", {company})
      })
  }
  deleteCompany(req, res, next){
    Company.deleteOne({slug:req.params.slug})
    .then(()=>{
      res.redirect('back')
    })
  }
  updateCompany(req, res, next){
    Company.findOne({slug:req.params.slug}).lean()
    .then((company)=>{
      res.render('updateCompany',{company})
    })
  }
  PostUpdateCompany(){
    
  }
}

module.exports = new SiteControllers();
