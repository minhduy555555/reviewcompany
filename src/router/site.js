const express = require("express")
const router = express.Router()
const siteController = require('../controllers/SiteControllers')

// chú ý router đi từ trên xuống
router.get('/home', siteController.home)
