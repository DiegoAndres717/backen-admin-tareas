//rutas para crear usuarios
const express = require('express');
const { crearUsuario } = require('../controllers/usuario');
const router = express.Router();
const { check } = require('express-validator');  

//crear usuarios
router.post('/',
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password es minimo de 6 caracteres').isLength({ min: 6 })
    ],
    crearUsuario
);


module.exports = router;
