var express = require('express');
var app = express();
var Convenio = require('../models/Convenio');
var mdAuth = require('../middlewares/autenticacion');

/* ====================================================
            GET Convenio - jefe de programa
=======================================================*/

app.get('/jefePrograma:programa', mdAuth.VerificarToken, (req, res) => {

    var programa = req.params.programa;
    Convenio.find({programa: programa}).populate('programa').populate('empresa').exec((err, convenios) => {

            if (err) {
                res.status(500).json({
                    ok: true,
                    mensaje: 'Lo sentimos, ocurrió un error'
                });

            } else {
                res.status(200).json({
                    ok: true,
                    mensaje: 'Petición realizada correctamente',
                    convenios: convenios
                });
            }
        });
});

/* ====================================================
            GET Convenio - jefe de programa
=======================================================*/

app.get('/', mdAuth.VerificarToken, (req, res) => {

    Convenio.find({}).populate('programa').populate('empresa').exec((err, convenios) => {

            if (err) {
                res.status(500).json({
                    ok: true,
                    mensaje: 'Lo sentimos, ocurrió un error'
                });

            } else {
                res.status(200).json({
                    ok: true,
                    mensaje: 'Petición realizada correctamente',
                    convenios: convenios
                });
            }
        });
});


/* ====================================================
                    POST Convenio
=======================================================*/
app.post('/', [mdAuth.VerificarToken], (req, res) => {

    var body = req.body;
    var convenio = new Convenio({
        empresa: body.empresa,
        programa: body.programa,
        rutapdf: '',
        estado: 'Activo'
    });

    convenio.save((err, convenioGuardado) => {

        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'Lo sentimos, ocurrió un error',
                err: err
            });

        } else {

            res.status(200).json({
                ok: true,
                mensaje: 'Petición realizada correctamente',
                convenioGuardado: convenioGuardado
            });
        }
    });

});

module.exports = app;