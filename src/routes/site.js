const express = require('express')
const router = express.Router()
const siteController = require("../controllers/siteControllers")
var upload = require("../middlewares/mdwupload")
var middlewares = require('../middlewares/authent')



// chú ý tuyến đường đi từ trên xuống
router.get('/me/updateCompany/:slug', siteController.updateCompany)
router.put('/me/updateCompany/:slug', siteController.PostUpdateCompany)
router.get('/me/stored/:slug', siteController.stored)
router.delete('/me/delete/:slug', siteController.deleteCompany)
router.put('/profile/update/:slug',upload.single('avatar'), siteController.updateProfile)
router.get('/profile/:slug', siteController.profile)
router.get('/detail/:slug',middlewares.addView, siteController.detail)
router.patch('/like/company/:id', siteController.likeCompany)
router.patch('/unLike/company/:id', siteController.unLikeCompany)
router.get('/company/search', siteController.search)
router.get('/login', siteController.login)
router.get('/admin/:slug', siteController.admin)
router.post('/login', siteController.postLogin)
router.get('/logout', siteController.logout)
router.get('/register', siteController.register)
router.post('/register', siteController.postRegister)
router.get('/rank', siteController.rankCompanies)
router.get('/contact', siteController.contact)
router.get('/company/sort/:field', siteController.sortField)
router.get('/home/companies', siteController.homeCompanies)
router.get('/', siteController.home)

module.exports = router
