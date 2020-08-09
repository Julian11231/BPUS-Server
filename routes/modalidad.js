var express = require('express');
var app = express();

// Importamos el modelo de la modalidad
var Modalidad = require('../models/modalidad');

// Importamos el middleware de auth
var mdAuth = require('../middlewares/autenticacion');


app.get('/', mdAuth.VerificarToken, (req, res) => {

    // Buscamos todas las modalidades
    Modalidad.find({}, (err, modalidades) => {

        // Si hay un error...
        if (err) {
            res.status(500).json({

                ok: false,
                mensaje: 'Lo sentimos, hubo un error'
            });

        } else {

            // Si todo sale bien...
            res.status(200).json({

                ok: true,
                modalidades: modalidades
            });

        }
    });
});


module.exports = app;