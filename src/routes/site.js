const express = require('express')
const router = express.Router()
const siteController = require("../controllers/SiteControllers")

// chú ý tuyến đường đi từ trên xuống
router.get('/', siteController.home)

module.exports = router