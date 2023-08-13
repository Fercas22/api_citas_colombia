const express = require('express');
const router = express.Router();
const middleware = require('../middlewares/middlwares');
const login = require('../controllers/login');

// Iniciar sesion
router.post('/login', login.login);

// Cerrar sesion
router.post('/logout', middleware.verify, login.logout);

// Registrar usuario
router.post('/registeruser', middleware.verifyEmail, login.register);

module.exports = router;