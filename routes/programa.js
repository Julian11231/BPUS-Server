var express = require('express');
var app = express();

// Importamos el modelo de los programas
var Programa = require('../models/programa');
var mdAuth = require('../middlewares/autenticacion');

app.get('/:id', (req, res) => {

    // Obtenemos el id enviado por la url
    var id = req.params.id;

    // Buscamos el programa por id
    Programa.findById(id).populate('jefe').exec((err, programa)=> { 

        // Si hay un error...
        if (err) {
            res.status(500).json({

                ok: false,
                mensaje: 'Lo sentimos, hubo un error',
                error: err
            });

        } else {

            // Si todo sale bien, retornamos lo que encontró
            res.status(200).json({
                ok: true,
                programa: programa
            });
        }
    });
});


module.exports = app;