const express = require('express')
const router = express.Router()
const CreateController = require("../controllers/createControllers")

// chú ý tuyến đường đi từ trên xuống
router.post('/post/company', CreateController.postCompany)
router.get('/form/company', CreateController.createCompany)

module.exports = router