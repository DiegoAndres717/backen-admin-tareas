//rutas para crear proyectos
const express = require('express');
const router = express.Router();
const {check} = require('express-validator')
const auth = require('../middleware/auth')
const { crearProyecto, getProyectos, updateProyectos, deleteProyecto } = require('../controllers/proyecto');

//crear proyectos
router.post('/', 
    auth,
    [
        check('nombre', 'el nombre es obligatorio').not().isEmpty()
    ],
    crearProyecto,
);

//crear proyectos
router.get('/', 
    auth,
    getProyectos,
);
//actualizar
router.put('/:id', 
    auth,
    [
        check('nombre', 'el nombre es obligatorio').not().isEmpty()
    ],
    updateProyectos,
);
//eliminar
router.delete('/:id', 
    auth,
    deleteProyecto,
);


module.exports = router;

