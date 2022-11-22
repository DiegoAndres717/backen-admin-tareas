//rutas para autenticar usuarios
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');  
const { autenticarUsuario, getUsuario } = require('../controllers/auth');
const auth = require('../middleware/auth');

// usuarios
router.post('/',
    autenticarUsuario
);
//obtener usuarios
router.get('/', 
    auth,
    getUsuario
)

module.exports = router;