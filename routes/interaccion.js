const express = require('express');
const router = express.Router();
const middleware = require('../middlewares/middlwares');
const controller = require('../controllers/interaccion');

// Interaccion like
router.post('/like', middleware.verify, controller.like);

// Interaccion favoritos
router.post('/favorite', middleware.verify, controller.favorite);

// Interaccion vistas
router.post('/view', middleware.verify, controller.view);

module.exports = router;