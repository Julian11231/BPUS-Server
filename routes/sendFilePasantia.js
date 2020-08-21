var express = require('express');

var fileSystem = require('fs');
var path = require('path');
var mdAuth = require('../middlewares/autenticacion');

var app = express();


app.get('/:idEstudiante/:file', mdAuth.VerificarToken, (req, res) => {

    var id_estudiante = req.params.idEstudiante;
    var file = req.params.file;

    var pathFile = path.resolve(__dirname, `../uploads/documents/pasantia/${id_estudiante}/${file}`);

    if (fileSystem.existsSync(pathFile)) {
        res.sendFile(pathFile);

    } else {
        var pathNoImage = path.resolve(__dirname, '../assets/no-img.jpg');
        res.sendFile(pathNoImage);
    }

});

module.exports = app;