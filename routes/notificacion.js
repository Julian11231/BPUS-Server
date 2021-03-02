var express = require('express');
var app = express();
var nodemailer = require('nodemailer');

var Notificacion = require('../models/Notificacion');
var mdAuth = require('../middlewares/autenticacion');

/* ====================================================
                GET Notificaciones
=======================================================*/

app.get('/:usuarioId', [mdAuth.VerificarToken], (req, res) => {
    var usuarioId = req.params.usuarioId;
    Notificacion.find({'receptor': usuarioId}).sort({'fecha':1}).populate('receptor').exec((err, notificaciones) => {

        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'Lo sentimos, ocurrió unn error',
                er: err
            });
        } else {
            res.status(200).json({
                ok: true,
                mensaje: 'Petición realizada correctamente',
                notificaciones: notificaciones
            });
        }
    });
});

/* ====================================================
                GET Notificacion - Nav
=======================================================*/

app.get('/notificacionesNav/:usuarioId', [mdAuth.VerificarToken], (req, res) => {
    var usuarioId = req.params.usuarioId;
    Notificacion.find({'receptor': usuarioId, 'isRead': false}).sort({'fecha':-1}).populate('receptor').limit(3).exec((err, notificaciones) => {

        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'Lo sentimos, ocurrió un error'
            });
        } else {
            res.status(200).json({
                ok: true,
                mensaje: 'Petición realizada correctamente',
                notificaciones: notificaciones
            });
        }
    });
});

app.post('/', [mdAuth.VerificarToken], (req, res) => {

    var body = req.body;
    var notificacion = new Notificacion({

        receptor: body.receptor,
        fecha: body.fecha,
        mensaje: body.mensaje,
        mensajeDetalle: body.mensajeDetalle,
        isRead: false,
        onModel: body.onModel

    });

    notificacion.save((err, notificacionGuardada) => {

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
                notificacionGuardada: notificacionGuardada
            });
        }
    });
});


app.post('/correo', [mdAuth.VerificarToken], (req, res) => {

    var body = req.body;

    var transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        auth: {
          user: "juan.quintero.test@gmail.com",
          pass: "TesisCruelAngel01"
        }
      });

      // verify connection configuration
    transporter.verify(function(error, success) {
        if (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            mensaje: 'Lo sentimos, ocurrió un error',
            err: err
        });
        } else {
            var mailOptions = {
                from: 'juan.quintero.test@gmail.com',
                to: 'u20161146030@usco.edu.co',
                subject: body.mensaje,
                text: body.mensajeDetalle
            };
        
            transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
                res.status(500).json({
                    ok: false,
                    mensaje: 'No se pudo enviar el correo',
                    err: err
                });
            } else {
                console.log('Email sent: ' + info.response);
                res.status(200).json({
                    ok: true,
                    mensaje: 'Correro envidado exitosamente',
                });
            }
            });
        }
    });
});

module.exports = app;