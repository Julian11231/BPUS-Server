var express = require('express');
var app = express();

var Vacante = require('../models/Vacante');
var mdAuth = require('../middlewares/autenticacion');

/* ====================================================
                    GET VACANTES-ENCARGADO
=======================================================*/

app.get('/encargado:encargado', mdAuth.VerificarToken, (req, res) => {
    var encargado = req.params.encargado;
    Vacante.find({encargado: encargado}).populate('encargado').populate('empresa').populate('programa').exec((err, vacantes) => {

        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'Lo sentimos, ocurrió un error'
            });
        } else {
            res.status(200).json({
                ok: true,
                mensaje: 'Petición realizada correctamente',
                vacantes: vacantes
            });
        }
    });
});
/* ====================================================
                    GET VACANTES-ESTUDIANTE
=======================================================*/

app.get('/estudiante:programa', mdAuth.VerificarToken, (req, res) => {
    var programa = req.params.programa;
    Vacante.find({programa: programa}).populate('encargado').populate('empresa').populate('programa').exec((err, vacantes) => {

        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'Lo sentimos, ocurrió un error'
            });
        } else {
            res.status(200).json({
                ok: true,
                mensaje: 'Petición realizada correctamente',
                vacantes: vacantes
            });
        }
    });
});

/* ====================================================
                    GET VACANTES-ADMIN
=======================================================*/

app.get('/', mdAuth.VerificarToken, (req, res) => {
    Vacante.find({}).populate('encargado').populate('empresa').populate('programa').exec((err, vacantes) => {

        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'Lo sentimos, ocurrió un error'
            });
        } else {
            res.status(200).json({
                ok: true,
                mensaje: 'Petición realizada correctamente',
                vacantes: vacantes
            });
        }
    });
});
/* ====================================================
                    POST VACANTES
=======================================================*/
app.post('/', [mdAuth.VerificarToken], (req, res) => {

    var body = req.body;
    var vacante = new Vacante({

        titulo: body.titulo,
        funciones: body.funciones,
        descripcion: body.descripcion,
        empresa: body.empresa,
        programa: body.programa,
        encargado: body.encargado,
        ubicacion: body.ubicacion,
        modalidad: body.modalidad,
        cantidad: body.cantidad,
        pagada: body.pagada,
        letra: body.titulo.substring(0, 1),
        estado: 'Activa'

    });

    vacante.save((err, vacanteGuardada) => {

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
                vacanteGuardada: vacanteGuardada
            });
        }
    });

});

/* ====================================================
                    PUT Vacantes
=======================================================*/
app.put('/:id', [mdAuth.VerificarToken], (req, res) => {

    var body = req.body;
    var id = req.params.id;

    Vacante.findById(id, (err, vacante) => {

        if (err) {
            res.status(500).json({

                ok: false,
                mensaje: 'Lo sentimos, ocurrió un error',
                err: err
            });

        } else if (!vacante) {

            res.status(400).json({

                ok: false,
                mensaje: 'No se encontró ninguna vacante',
                err: err
            });

        } else {

            var titulo = body.titulo;
            vacante.titulo = titulo;
            vacante.funciones = body.funciones;
            vacante.descripcion = body.descripcion;
            vacante.empresa = body.empresa;
            vacante.programa = body.programa;
            vacante.encargado = body.encargado;
            vacante.ubicacion = body.ubicacion;
            vacante.modalidad = body.modalidad;
            vacante.cantidad = body.cantidad;
            vacante.pagada = body.pagada;
            vacante.letra = titulo.substring(0, 1);
            vacante.estado = body.estado;

            vacante.save((err, vacanteAcatualizada) => {

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
                        vacanteAcatualizada: vacanteAcatualizada
                    });
                }


            });
        }
    });

});

/* ====================================================
                    DELETE VACANTE
=======================================================*/
app.delete('/:id', [mdAuth.VerificarToken], (req, res) => {

    var id = req.params.id;

    Vacante.findByIdAndRemove(id, (err, vacanteEliminada) => {

        if (err) {
            res.status(500).json({

                ok: false,
                mensaje: 'Lo sentimos, ocurrió un error',
                err: err
            });

        } else if (!vacanteEliminada) {

            res.status(400).json({

                ok: false,
                mensaje: 'No se encontró ninguna vacante',
                err: err
            });

        } else {

            res.status(200).json({

                ok: true,
                mensaje: 'Petición realizada correctamente',
                vacanteEliminada: vacanteEliminada
            });

        }

    });
});

module.exports = app;
