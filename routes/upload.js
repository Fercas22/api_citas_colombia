const express = require('express');
const router = express.Router();
const middleware = require('../middlewares/middlwares');
const controller = require('../controllers/upload')

router.post('/uploadImage', middleware.verify, controller.upload)
router.post('/uploadImages', middleware.verify ,controller.uploadImages)
router.delete('/delete', middleware.verify, controller.deleteElementArrayImage)

module.exports = router