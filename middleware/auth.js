const jwt = require('jsonwebtoken')


module.exports = function( req, res, next ) {
    //leer el token del header
    const token = req.header('x-token')
    //revisar si no hay token
    if (!token) {
        return res.status(401).json({
            msg: 'No token'
        })
    }
    //validar token
    try {
        const cifrado = jwt.verify(token, process.env.SECRET);
        req.usuario = cifrado.usuario;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token not valid'
        })
    }
}