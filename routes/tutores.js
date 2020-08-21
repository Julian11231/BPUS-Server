var express = require('express');
var mdAuth = require('../middlewares/autenticacion');
var Administrativo = require('../models/administrativo');

var app = express();

app.get('/:idPrograma', [mdAuth.VerificarToken, mdAuth.VerificarJefePrograma], (req, res) => {

    var idPrograma = req.params.idPrograma;

    Administrativo.find({ programa: idPrograma }, (err, admins) => {

        if (err) {
            res.status(400).json({
                ok: false,
                mensaje: 'Hubo un error!'
            });
        } else {
            res.status(200).json({
                ok: true,
                mensaje: 'Petición realizada correctamente',
                admins: admins
            });
        }
    });
});

module.exports = app;