/*var express = require('express');
var app = express();

var fileUpload = require('express-fileupload');
var fileSystem = require('fs');

var Empresa = require('../models/Empresa');

var mdAdminAuth = require('../middlewares/autenticacion');

app.use(fileUpload());


app.put('/:id', mdAdminAuth.verificarToken, (req, res) => {

    var id = req.params.id;

    if (!req.files.imagenEmpresa) {

        res.status(500).json({
            ok: false,
            mensaje: "Lo sentimos, hubo un error al almacenar la imagen",
        });

    } else {

        var imagenEmpresa = req.files.imagenEmpresa;
        var imgEmpresa = setImagenEmpresa(imagenEmpresa, "imgEmpresa", id, res);

        Empresa.findByIdAndUpdate(id, { imagen: imgEmpresa }, (err, empresaAct) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    mensaje: "Lo sentimos, hubo un error al almacenar la imagen",
                    error: err
                });
            } else {
                res.status(200).json({
                    ok: true,
                    empresa: empresaAct
                });
            }
        });
    }

});


function setImagenEmpresa(imagen, tipoImagen, id, res) {

    var nombreCortado = imagen.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];

    // Hacemos una lista de las extensiones permitidas
    var extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'];

    if (extensionesValidas.indexOf(extensionArchivo) < 0) {

        return res.status(400).json({
            ok: false,
            mensaje: "Tipo de archivo no permitido",
        });

    } else {

        var nombreGuardar = `${id}-${tipoImagen}.${extensionArchivo}`;

        // Movemos el archivo a una carpeta del servidor
        var pathCrear = `./uploads/empresas/${id}`;
        var path = `./uploads/empresas/${id}/${nombreGuardar}`;

        if (!fileSystem.existsSync(pathCrear)) {
            fileSystem.mkdirSync(pathCrear);
        }

        if (fileSystem.existsSync(path)) {
            fileSystem.unlinkSync(path);
        }

        imagen.mv(path, err => {

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


module.exports = app;*/