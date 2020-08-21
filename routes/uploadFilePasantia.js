var express = require('express');
var fileUpload = require('express-fileupload');
var fileSystem = require('fs');
var Pasantia = require('../models/Pasantia');
var mdAuth = require('../middlewares/autenticacion');

var app = express();
app.use(fileUpload());

app.put('/:idEstudiante', [mdAuth.VerificarToken], (req, res) => {

    var id_estudiante = req.params.idEstudiante;

    if (!req.files.documento_propuesta) {
        console.log("")
    } else {
        var documento_propuesta = req.files.documento_propuesta;
        var documentoPropuesta = setDocumento(documento_propuesta, "documento_propuesta", id_estudiante, res);
        Pasantia.findOneAndUpdate({ estudiante: id_estudiante },
            { documento_propuesta: documentoPropuesta, estado_propuesta: "Enviada", notas_propuesta: "Enviado Correctamente" },
            (err, pasantiaAct) => {
                if (err) {
                    res.status(500).json({
                        ok: false,
                        mensaje: "Lo sentimos, hubo un error al almacenar el documento",
                        error: err
                    });
                } else {
                    res.status(200).json({
                        ok: true,
                        pasantia: pasantiaAct
                    });
                }
            });
    }

    if (!req.files.documento_informe7) {
        console.log("")
    } else {
        var documento_informe7 = req.files.documento_informe7;
        var documentoInf7 = setDocumento(documento_informe7, "documento_informe7", id_estudiante, res);
        Pasantia.findOneAndUpdate({ estudiante: id_estudiante },
            { documento_informe7: documentoInf7, estado_informe7: "Enviado", notas_informe7: "Enviado Correctamente" },
            (err, pasantiaAct) => {
                if (err) {
                    res.status(500).json({
                        ok: false,
                        mensaje: "Lo sentimos, hubo un error al almacenar el documento",
                        error: err
                    });
                } else {
                    res.status(200).json({
                        ok: true,
                        pasantia: pasantiaAct
                    });
                }
            });
    }

    if (!req.files.documento_informe14) {
        console.log("")
    } else {
        var documento_informe14 = req.files.documento_informe14;
        var documentoInf14 = setDocumento(documento_informe14, "documento_informe14", id_estudiante, res);
        Pasantia.findOneAndUpdate({ estudiante: id_estudiante },
            { documento_informe14: documentoInf14, estado_informe14: "Enviado", notas_informe14: "Enviado Correctamente" },
            (err, pasantiaAct) => {
                if (err) {
                    res.status(500).json({
                        ok: false,
                        mensaje: "Lo sentimos, hubo un error al almacenar el documento",
                        error: err
                    });
                } else {
                    res.status(200).json({
                        ok: true,
                        pasantia: pasantiaAct
                    });
                }
            });
    }

    if (!req.files.documento_informeFinal) {
        console.log("")
    } else {
        var documento_informeFinal = req.files.documento_informeFinal;
        var documentoInfFinal = setDocumento(documento_informeFinal, "documento_informeFinal", id_estudiante, res);
        Pasantia.findOneAndUpdate({ estudiante: id_estudiante },
            { documento_informeFinal: documentoInfFinal, estado_informeFinal: "Enviado", notas_informeFinal: "Enviado Correctamente" },
            (err, pasantiaAct) => {
                if (err) {
                    res.status(500).json({
                        ok: false,
                        mensaje: "Lo sentimos, hubo un error al almacenar el documento",
                        error: err
                    });
                } else {
                    res.status(200).json({
                        ok: true,
                        pasantia: pasantiaAct
                    });
                }
            });
    }
});





function setDocumento(documento, tipoDocumeto, id_estudiante, res) {

    var nombreCortado = documento.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];

    // Hacemos una lista de las extensiones permitidas
    var extensionesValidas = ['pdf', 'PDF'];

    if (extensionesValidas.indexOf(extensionArchivo) < 0) {

        return res.status(400).json({
            ok: false,
            mensaje: "Tipo de archivo no permitido",
        });

    } else {

        var nombreGuardar = `${id_estudiante}-${tipoDocumeto}.${extensionArchivo}`;

        // Movemos el archivo a una carpeta del servidor
        var pathCrear = `./uploads/documents/pasantia/${id_estudiante}`;
        var path = `./uploads/documents/pasantia/${id_estudiante}/${nombreGuardar}`;

        if (!fileSystem.existsSync(pathCrear)) {
            fileSystem.mkdirSync(pathCrear);
        }

        if (fileSystem.existsSync(path)) {
            fileSystem.unlinkSync(path);
        }

        documento.mv(path, err => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: "Error al mover el archivo",
                    error: err

                });
            }

        });

        return nombreGuardar;
    }
}


module.exports = app;