var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;


// Exportamos la función VerificarToken que autentica el usuario validando el token 
module.exports.VerificarToken = function (req, res, next) {

    // Obtenemos el token de la url
    var token = req.query.token;

    // Verificamos el token
    jwt.verify(token, SEED, (err, decoded) => {

        // Si hay error...
        if (err) {

            res.status(500).json({

                ok: false,
                mensaje: 'Token no válido'
            });

        } else {

            // Si es válido, lo dejamos pasar
            req.usuario = decoded.usuario;
            next();

        }

    });
}

module.exports.VerificarEstudiante = function (req, res, next) {

    var user = req.usuario;
    if (user.rol == "ESTUDIANTE") {
        next();
    } else {
        return res.status(403).json({
            ok: false,
            mensaje: "Usted no puede hacer eso"
        });
    }
}

module.exports.VerificarJefePrograma = function (req, res, next) {

    var user = req.usuario;
    if (user.rol == "JEFE_PROGRAMA") {
        next();
    } else {
        return res.status(403).json({
            ok: false,
            mensaje: "Usted no puede hacer eso"
        });
    }
}