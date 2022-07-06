const express = require('express')
const router = express.Router()
const CreateController = require("../controllers/createControllers")
var middlewares = require('../middlewares/authent')
var upload = require("../middlewares/mdwupload")

// chú ý tuyến đường đi từ trên xuống
router.post('/post/company',upload.single('logo'), CreateController.postCompany)
//router.post('/post/logo', upload.single('logo'), CreateController.postLogo)
router.get('/form/company',middlewares.authet, CreateController.createCompany)

module.exports = router