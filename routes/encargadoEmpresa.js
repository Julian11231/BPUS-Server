var express = require('express');
var app = express();
var EncargadoEmpresa = require('../models/EncargadoEmpresa');
var mdAuth = require('../middlewares/autenticacion');
var bcrypt = require('bcryptjs');

/* ====================================================
                    GET EncargadoEmpresa
=======================================================*/

app.get('/', mdAuth.VerificarToken, (req, res) => {

    EncargadoEmpresa.find({})
        .populate('programa').populate('empresa')
        .exec((err, encargadoEmpresa) => {

            if (err) {
                res.status(500).json({

                    ok: true,
                    mensaje: 'Lo sentimos, ocurrió un error'
                });

            } else {

                res.status(200).json({

                    ok: true,
                    mensaje: 'Petición realizada correctamente',
                    encargadoEmpresa: encargadoEmpresa
                });
            }
        });
});


/* ====================================================
                    POST EncargadoEmpresa
=======================================================*/
app.post('/', [mdAuth.VerificarToken, mdAuth.VerificarJefePrograma], (req, res) => {

    var body = req.body;
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(body.contraseña, salt);
    console.log(hash);

    var encargadoEmpresa = new EncargadoEmpresa({

        identificacion: body.identificacion,
        nombre: body.nombre,
        correo: body.correo,
        telefono: body.telefono,
        imagen: null,
        contraseña: hash,
        empresa: body.empresa,
        programa: body.programa,
        cargo: body.cargo,
        rol: body.rol,
        estado: "Activo",

    });

    encargadoEmpresa.save((err, encargadoEmpresaGuardada) => {

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
                encargadoEmpresaGuardada: encargadoEmpresaGuardada
            });
        }
    });

});

module.exports = app;