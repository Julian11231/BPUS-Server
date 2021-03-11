var express = require('express');
var app = express();

var Pasantia = require('../models/Pasantia');
var Estudiante = require('../models/estudiante');

var mdAuth = require('../middlewares/autenticacion');

//=====================================================
//                   GET-PASANTIA
//=====================================================
app.get('/', [mdAuth.VerificarToken, /*mdAuth.VerificarJefePrograma, mdAuth.VerifyTutor*/], (req, res) => {

    Pasantia.find({'modalidad': '5eb57a1f54d7ac345dc39ca5', 'estado': 'Enviada',})
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

app.get('/tutor:tutor', [mdAuth.VerificarToken, /*mdAuth.VerificarJefePrograma, mdAuth.VerifyTutor*/], (req, res) => {
    var tutor = req.params.tutor;
    Pasantia.find({'modalidad': '5eb57a1f54d7ac345dc39ca5', tutor: tutor})
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
//                   GET-PASANTIA POR Empresa
//=====================================================
app.get('/empresa:empresa', [mdAuth.VerificarToken, /*mdAuth.VerificarJefePrograma, mdAuth.VerifyTutor*/], (req, res) => {
    var idempresa = req.params.empresa;
    Pasantia.find({'empresa': idempresa, 'estado': "PreInscrita", 'aprobacionEmpresa': false})
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
        .populate({path: 'vacante', populate: { path: 'encargado' } })
        .populate('tutor')
        .populate('modalidad')
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
//       PUT - PASANTIA- CAMBIAR ESTADO ENCARGADO
//=====================================================
app.put('/cambiarEstado:idEstudiante', [mdAuth.VerificarToken, mdAuth.VerificarEncargado], (req, res) => {

    var estado = req.query.estado;
    console.log(estado);
    var id = req.params.idEstudiante;
    console.log(id);

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

            pasantia.aprobacionEmpresa = estado;

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
        estado: 'PreInscrita',
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
    console.log(body);
    var id = req.params.id;
    console.log(id);

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