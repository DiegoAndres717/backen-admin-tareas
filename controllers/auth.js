const Usuario = require('../modules/Usuario')
const bcryptjs = require('bcryptjs')
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken');

const autenticarUsuario = async (req, res) => {

    //revisar si hay errores
    const errores = validationResult(req);
    if ( !errores.isEmpty()) {
        return res.status(400).json({
            errores: errores.array()
        })
    }
    //extraer email y password
    const { email, password  }= req.body;

    try {
        //revisar que usuario sea registrado
        let usuario = await Usuario.findOne({ email })
        if (!usuario) {
            return res.status(404).json({
                msg: 'Usuario no existe.'
            })
        }
         //revisar password
        const passCorrect = await bcryptjs.compare(password, usuario.password);
        if (!passCorrect) {
            return res.status(400).json({
                msg: 'password incorrect'
            })
        }
        //si todo es correcto //crear JWT
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
                msg: 'Login con exito',
                usuario,
                token
            })
        })

    } catch (error) {
        console.log(error);
    }

}

const getUsuario = async (req, res) => {

    try {
        const usuario = await Usuario.findById( req.usuario.id );
        res.json({ usuario });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Hubo un error'
        })
    }
}

module.exports = {
    autenticarUsuario,
    getUsuario
}
