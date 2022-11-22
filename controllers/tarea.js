const Proyecto = require("../modules/Proyecto");
const Tarea = require("../modules/Tarea");
const { validationResult } = require("express-validator");

crearTarea = async (req, res) => {
  //revisar si hay errores
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({
      errores: errores.array(),
    });
  }

  try {
    const { proyecto } = req.body;
    const existeProyecto = await Proyecto.findById(proyecto);
    if (!existeProyecto) {
      return res.status(204).json({
        msg: "Proyecto no encontrado",
      });
    }
    //revisar que el proyecto pertenezca al usuario
    if (existeProyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({
        msg: "No autorizado",
      });
    }
    //creamos la tarea
    const tarea = new Tarea(req.body);
    await tarea.save();
    res.json(tarea);
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};
//obtiene todo los proyectos
getTareas = async (req, res) => {
  try {
    const { proyecto } = req.query;
    const existeProyecto = await Proyecto.findById(proyecto);
    if (!existeProyecto) {
      return res.status(404).json({
        msg: "Proyecto no encontrado",
      });
    }
    //revisar que el proyecto pertenezca al usuario
    if (existeProyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({
        msg: "No autorizado",
      });
    }
    //obtener la tarea
    const tareas = await Tarea.find({ proyecto });
    res.json({ tareas });
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};
//actualizar proyectos
updateTareas = async (req, res) => {
  try {
    const { proyecto, nombre, estado } = req.body;
    //si tarea existe
    let tarea = await Tarea.findById(req.params.id);
    if (!tarea) {
      return res.status(404).json({
        msg: " No existe la tarea",
      });
    }

    const existeProyecto = await Proyecto.findById(proyecto);

    //revisar que el proyecto pertenezca al usuario
    if (existeProyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({
        msg: "No autorizado",
      });
    }

    //crear nuevo objeto
    const nuevaTarea = {};
    if (nombre) {
      nuevaTarea.nombre = nombre;
    }
    if (estado) {
      nuevaTarea.estado = estado;
    }
    //guardar tarea
    tarea = await Tarea.findOneAndUpdate({ _id: req.params.id }, nuevaTarea, {
      new: true,
    });
    res.json({ tarea });
  } catch (error) {
    console.log(error);
    res.status(500).send("hubo un error");
  }
};
//eliminar
deleteTareas = async (req, res, next) => {
  try {
    const { proyecto } = req.body;
    //si tarea existe
    let tarea = await Tarea.findById(req.params.id);
    if (!tarea) {
      return res.status(404).json({
        msg: " No existe la tarea",
      });
    }
    const existeProyecto = await Proyecto.findById(proyecto);

    //revisar que el proyecto pertenezca al usuario
    if (existeProyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({
        msg: "No autorizado",
      });
    }

    //eliminar tarea
    await Tarea.findOneAndRemove({ _id: req.params.id });
    res.json({
      msg: "Tarea eliminada",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("hubo un error");
  }
};

module.exports = {
  crearTarea,
  getTareas,
  updateTareas,
  deleteTareas,
};
