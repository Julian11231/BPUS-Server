// Iniciamos el servidor express
var express = require('express');
var mongoose = require('mongoose');

// Importamos la librería de cors
var cors = require('cors');

var bodyParser = require('body-parser');

var app = express();


// Middleware de Cors
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:4200");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    next();
});


// Body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// Importación de rutas
var mainRoute = require('./routes/main');
var loginRoute = require('./routes/login');
var imagenRoute = require('./routes/imagen');
var modalidadRoute = require('./routes/modalidad');
var programaRoute = require('./routes/programa');
var gestPasantiaRoute = require('./routes/pasantia');
var empresasRoute = require('./routes/empresa');
var vacantesRoute = require('./routes/vacantes');
var uploadRoute = require('./routes/uploadFilePasantia');
var sendRoute = require('./routes/sendFilePasantia');
var tutoresRoute = require('./routes/tutores');
var encargadoEmpresaRoute = require('./routes/encargadoEmpresa');
var convenioRoute = require('./routes/convenio');

// Rutas
app.use('/convenios', convenioRoute);
app.use('/encargadoEmpresa', encargadoEmpresaRoute);
app.use('/tutores', tutoresRoute);
app.use('/send_file_pasantia', sendRoute);
app.use('/upload_pasantia', uploadRoute);
app.use('/vacantes', vacantesRoute)
app.use('/empresas', empresasRoute);
app.use('/pasantia', gestPasantiaRoute);
app.use('/programa', programaRoute);
app.use('/modalidades', modalidadRoute);
app.use('/imagen', imagenRoute)
app.use('/login', loginRoute);
app.use('/', mainRoute);

//const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://adminBPUS:gVo3Mnd39q7ErzmK@bpuscluster.be1do.mongodb.net/BPUS?retryWrites=true&w=majority";
/*
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect((err) => {
    if(err){
        throw err;
    }else{
        console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');
    }
});

*/
mongoose.connection.openUri(uri, { useNewUrlParser: true, useUnifiedTopology: true },
    (err, res) => {

        if (err) {
            throw err;
        } else {
            console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');
        }

    });

app.listen(3000, () => {
    // Para cambiar el color de la palabra "online", se hace lo siguiente:
    console.log('Corriendo en el puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});