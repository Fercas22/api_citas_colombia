const express = require('express');
const router = express.Router();
const middleware = require('../middlewares/middlwares');
const user = require('../controllers/user');

// Ruta de prueba
router.get('/', user.index);

// Filtrar usuarios
router.get('/showuser', middleware.verify,user.showUser)
router.get('/filters',middleware.verify ,user.filterMultiple)
// Actualizar usuario
router.put('/updregister', middleware.verify, user.updRegister);
// Eliminar usuario (cuenta)
router.delete('/delregister', middleware.verify, user.delRegister);

// Aditionals
router.put('/updaditionals', user.updateAditionals);
router.get('/showaditionals', user.showAditionals);

module.exports = router;

