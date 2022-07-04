const express = require('express')
const router = express.Router()
const CreateController = require("../controllers/createControllers")
var middlewares = require('../middlewares/authent')

// chú ý tuyến đường đi từ trên xuống
router.post('/post/company', CreateController.postCompany)
router.get('/form/company',middlewares.authet, CreateController.createCompany)

module.exports = router