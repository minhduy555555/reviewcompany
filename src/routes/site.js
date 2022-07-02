const express = require('express')
const router = express.Router()
const siteController = require("../controllers/SiteControllers")

// chú ý tuyến đường đi từ trên xuống
router.get('/home/companies', siteController.homeCompanies)
router.get('/', siteController.home)

module.exports = router