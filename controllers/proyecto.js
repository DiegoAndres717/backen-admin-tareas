const Proyecto = require('../modules/Proyecto')
const { validationResult } = require('express-validator')

crearProyecto = async ( req, res ) => {

    //revisar si hay errores
    const errores = validationResult(req);
    if ( !errores.isEmpty()) {
        return res.status(400).json({
            errores: errores.array()
        })
    }

    try {
        //crar nuevo proyecto
        const proyecto = new Proyecto(req.body);
        //guardar creador
        proyecto.creador = req.usuario.id;
        //guardar proyecto
        proyecto.save();
        res.json(proyecto);

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error')
    }
}
//obtiene todo los proyectos
getProyectos = async ( req, res ) => {

    try {
        const proyectos = await Proyecto.find({ creador: req.usuario.id });
        res.json({ proyectos })
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error')
    }
}
//actualizar proyectos
updateProyectos = async ( req, res ) => {

    //revisar si hay errores
    const errores = validationResult(req);
    if ( !errores.isEmpty()) {
        return res.status(400).json({
            errores: errores.array()
        })
    }
    //extraer inf del proyecto
    const { nombre } = req.body;
    const nuevoProyecto = {};
    if (nombre) {
        nuevoProyecto.nombre = nombre;
    }

    try {
        //revisar id
        let proyecto = await Proyecto.findById(req.params.id);
        //revisando si existe proyecto
        if (!proyecto) {
            return res.status(404).json({
                msg: 'Proyecto no encontrado'
            })
        }
        //revisar el creador del pro
        if(proyecto.creador.toString() !== req.usuario.id ){
            return res.status(401).json({
                msg: 'No autorizado'
            })
        }
        //actualizar proyect
        proyecto = await Proyecto.findByIdAndUpdate({ _id: req.params.id }, { $set: nuevoProyecto }, { new: true });
        res.json({ proyecto });

    } catch (error) {
        console.log(error);
        res.status(500).send('hubo un error');
    }
}
//eliminar
deleteProyecto = async ( req, res, next ) => {

    try {
        //revisar id
        let proyecto = await Proyecto.findById(req.params.id);
        //revisando si existe proyecto
        if (!proyecto) {
            return res.status(404).json({
                msg: 'Proyecto no encontrado'
            })
        }
        //revisar el creador del pro
        if(proyecto.creador.toString() !== req.usuario.id ){
            return res.status(401).json({
                msg: 'No autorizado'
            })
        }
        //eliminar el proyecto
        await Proyecto.findOneAndRemove({ _id: req.params.id });
        res.json({
            msg: 'Proyecto eliminado'
        })

    } catch (error) {
        console.log(error);
        res.status(500).send('hubo un error');
    }
}


module.exports = {
    crearProyecto,
    getProyectos,
    updateProyectos,
    deleteProyecto
}
