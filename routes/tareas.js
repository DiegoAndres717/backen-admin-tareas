//rutas para crear proyectos
const express = require('express');
const router = express.Router();
const {check} = require('express-validator')
const auth = require('../middleware/auth')
const { crearTarea, getTareas, updateTareas, deleteTareas } = require('../controllers/tarea');

//crear proyectos
router.post('/', 
    auth,
    [
        check('nombre', 'el nombre es obligatorio').not().isEmpty(),
        check('proyecto', 'el proyecto es obligatorio').not().isEmpty()
    ],
    crearTarea,
);

//crear proyectos
router.get('/', 
    auth,
    getTareas,
);
//actualizar
router.put('/:id', 
    auth,
    updateTareas,
);
//eliminar
router.delete('/:id', 
    auth,
    deleteTareas,
);

module.exports = router;
