const Usuario = require('../modules/Usuario')
const bcryptjs = require('bcryptjs')
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken');

crearUsuario = async (req, res) => {

    //revisar si hay errores
    const errores = validationResult(req);
    if ( !errores.isEmpty()) {
        return res.status(400).json({
            errores: errores.array()
        })
    }

    //extraer email y password
    const { email, password } = req.body;

    try {
        //validar que usuario sea unico
        let usuario = await Usuario.findOne({ email });
        if (usuario) {
            return res.status(400).json({
                msg: 'El usuario ya existe'
            })
        }
        //crear el usuario
        usuario = new Usuario(req.body);

        //encriptar password
        const salt = await bcryptjs.genSalt(10);
        usuario.password = await bcryptjs.hash(password, salt);

        //guardar usuario
        await usuario.save();

        //crear JWT
        const payload = {
            usuario: {
                id: usuario.id,
            }
        };
        //firmar el token
        jwt.sign(payload, process.env.SECRET, {
            expiresIn: '24h'
        }, (error, token)=> {
            if(error) throw error;

            //mensaje de confirmacion
            res.status(200).json({
                msg: 'El usuario fue creado con exito',
                usuario,
                token
            })
        })

    } catch (error) {
        console.log(error);
        res.status(400).send('Hubo un error')
    }
}

module.exports = {
    crearUsuario,
}
