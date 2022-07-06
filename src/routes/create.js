const express = require('express')
const router = express.Router()
const CreateController = require("../controllers/createControllers")
var middlewares = require('../middlewares/authent')
var upload = require("../middlewares/mdwupload")

// chú ý tuyến đường đi từ trên xuống
router.post('/comment', CreateController.postComment)
router.post('/post/company', upload.array('albums', 3), CreateController.postCompany)
router.get('/form/company',middlewares.authet, CreateController.createCompany)

module.exports = router