var express = require('express');
var app = express();

var Pasantia = require('../models/Pasantia');
var Estudiante = require('../models/estudiante');

var mdAuth = require('../middlewares/autenticacion');

//=====================================================
//                   GET-PASANTIA
//=====================================================
app.get('/', [mdAuth.VerificarToken, /*mdAuth.VerificarJefePrograma, mdAuth.VerifyTutor*/], (req, res) => {

    Pasantia.find({})
        .populate('estudiante')
        .populate('modalidad')
        .populate('empresa')
        .populate({path: 'vacante', populate: { path: 'encargado' } })
        .populate('tutor')
        .exec((err, pasantias) => {

            if (err) {

                res.status(500).json({
                    ok: false,
                    mensaje: 'Lo sentimos, ha ocurrido un error'
                });
            } else {

                res.status(200).json({
                    ok: true,
                    mensaje: 'Petición realizada correctamente',
                    pasantias: pasantias
                });
            }
        });
});


//=====================================================
//                   GET-PASANTIA POR ID
//=====================================================
app.get('/:id', [mdAuth.VerificarToken], (req, res) => {

    var id = req.params.id;

    Pasantia.findById(id)
        .populate('estudiante')
        .populate('empresa')
        .populate('vacante')
        .populate('tutor')
        .exec((err, pasantia) => {

            if (err) {

                res.status(500).json({
                    ok: false,
                    mensaje: 'Lo sentimos, ha ocurrido un error'
                });

            } else if (!pasantia) {

                res.status(500).json({
                    ok: false,
                    mensaje: 'Lo sentimos, no se encontró su solicitud'
                });

            } else {

                res.status(200).json({
                    ok: true,
                    mensaje: 'Petición realizada correctamente',
                    pasantia: pasantia
                });
            }
        });
});




//=====================================================
//                   POST-PASANTIA
//=====================================================
app.post('/:idEstudiante', [mdAuth.VerificarToken, mdAuth.VerificarEstudiante], (req, res) => {

    var body = req.body;
    var idEstudiante = req.params.idEstudiante;

    var epsEstudiante = body.eps;

    var solicitud = new Pasantia({

        estudiante: idEstudiante,
        modalidad: "5eb57a1f54d7ac345dc39ca5",
        empresa: body.empresa,
        vacante: body.vacante,
        estado: 'Enviada',
        fecha: Date.now()

    });

    solicitud.save((err, solicitudGuardada) => {

        if (err) {

            res.status(500).json({
                ok: false,
                mensaje: 'Lo sentimos, ha ocurrido un error',
                err: err
            });
        } else {

            Estudiante.findById(idEstudiante, (err, estudiante) => {

                estudiante.modalidad = solicitudGuardada._id;
                estudiante.eps = epsEstudiante;
                estudiante.save((err, estudianteActualizado) => {

                    res.status(200).json({
                        ok: true,
                        mensaje: 'Petición realizada correctamente',
                        solicitudGuardada: solicitudGuardada,
                        estudianteActualizado: estudianteActualizado
                    });
                });

            });
        }
    });
});


/* ====================================================
                    PUT PASANTIA
=======================================================*/
app.put('/:id', [mdAuth.VerificarToken], (req, res) => {

    var body = req.body;
    var id = req.params.id;

    Pasantia.findById(id, (err, pasantia) => {

        if (err) {
            res.status(500).json({

                ok: false,
                mensaje: 'Lo sentimos, ocurrió un error',
                err: err
            });

        } else if (!pasantia) {

            res.status(400).json({

                ok: false,
                mensaje: 'No se encontró ninguna solicitud',
                err: err
            });

        } else {

            pasantia.estado_propuesta = body.estado_propuesta
            pasantia.notas_propuesta = body.notas_propuesta

            pasantia.estado_informe7 = body.estado_informe7;
            pasantia.notas_informe7 = body.notas_informe7;

            pasantia.estado_informe14 = body.estado_informe14
            pasantia.notas_informe14 = body.notas_informe14

            pasantia.estado_informeFinal = body.estado_informeFinal
            pasantia.notas_informeFinal = body.notas_informeFinal

            pasantia.tutor = body.tutor;
            pasantia.notas = body.notas;
            pasantia.estado = body.estado;

            pasantia.save((err, pasantiaActualizada) => {

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
                        pasantiaActualizada: pasantiaActualizada
                    });
                }
            });
        }
    });

});



module.exports = app;