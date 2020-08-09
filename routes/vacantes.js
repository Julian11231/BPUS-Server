var express = require('express');
var app = express();

var Vacante = require('../models/Vacante');
var mdAuth = require('../middlewares/autenticacion');

/* ====================================================
                    GET VACANTES
=======================================================*/

app.get('/', mdAuth.VerificarToken, (req, res) => {

    Vacante.find({}).populate('empresa').populate('programa').exec((err, vacantes) => {

        if (err) {
            res.status(500).json({

                ok: true,
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
app.post('/', [mdAuth.VerificarToken, mdAuth.VerificarJefePrograma], (req, res) => {

    var body = req.body;
    var titulo = body.titulo;

    var vacante = new Vacante({

        titulo: titulo,
        funciones: body.funciones,
        descripcion: body.descripcion,
        empresa: body.empresa,
        programa: body.programa,
        ubicacion: body.ubicacion,
        modalidad: body.modalidad,
        cantidad: body.cantidad,
        pagada: body.pagada,
        letra: titulo.substring(0, 1),
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
app.put('/:id', [mdAuth.VerificarToken, mdAuth.VerificarJefePrograma], (req, res) => {

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
app.delete('/:id', [mdAuth.VerificarToken, mdAuth.VerificarJefePrograma], (req, res) => {

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
