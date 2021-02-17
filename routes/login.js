var express = require('express');

var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;
var bcrypt = require('bcryptjs');
var Request = require('request');



// Importamos los modelos
var Estudiante = require('../models/estudiante');
var Administrativo = require('../models/administrativo');
var EncargadoEmpresa = require('../models/EncargadoEmpresa');
var Programa = require('../models/programa');

// API_KEYS
const API_KEY_ESTUDIANTES = "dcbc8129-7df3-4607-9715-ad01ec5f8724"
const API_KEY_ADMINISTRATIVOS = "79bcb6ef-c023-4ca1-98c5-8c244c2e0a3c"

var app = express();

app.post('/', (req, res) => {

    var body = req.body;

    // Se captura el usuario y contraseña
    var usuario = body.usuario;
    var contrasena = body.contrasena;

    // Definimos los programas válidos
    const FacuIngenieria = [

        "Ingeniería Agrícola",
        "Ingeniería Agroindustrial",
        "Ingeniería Electrónica",
        "Ingeniería Civil",
        "Ingeniería de Petroleos",
        "Ingeniería de Software",
        "Tecnología en Desarrollo de Software",
        "Tecnología en Construcción de Obras Civiles"
    ]

    // Revisamos que el usuario digitado sea un estudiante (tiene una 'u') o administrativo
    var ifEstudiante = usuario.indexOf('u');


    // Si es un estudiante...
    if (ifEstudiante >= 0) {
        // Accedemos al servicio que regresa los estudiantes enviando el usuario
        Estudiante.find({ usuario: usuario }).populate('programa').populate('modalidad').exec((err, estudianteEncotrado) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    mensaje: 'Lo sentimos, hubo un problema en el servidor'
                });

            }
            else{
                if (estudianteEncotrado.length > 0) { 

                    if (!bcrypt.compareSync(contrasena, estudianteEncotrado[0].contraseña)) {
                        res.status(500).json({
                            ok: false,
                            mensaje: 'Contraseña Incorrecta'
                        });

                        // Si todo sale bien...
                    } else {

                        // Se crea un token para validar la autenticacíon del estudiante
                        var token = jwt.sign({ usuario: estudianteEncotrado[0] }, SEED, { expiresIn: 999999999999 });

                        estudianteEncotrado[0].contraseña = ":)"

                        // Finalmente se hace una respuesta, con la info del estudiante y el token
                        res.status(200).json({
                            ok: true,
                            mensaje: "Login Correcto",
                            token: token,
                            estudiante: estudianteEncotrado[0]
                        });
                    }

            } else {

                Request.get(`http://localhost:5000/estudiante/${API_KEY_ESTUDIANTES}/${usuario}`, (err, info, estudiante) => {

                    // Convertimos la respuesta en Json
                    var estudiante = JSON.parse(estudiante);
        
                    if (err) {
                        res.status(500).json({
                            ok: false,
                            mensaje: 'Error en el servidor'
                        });
        
                    // Si no encontró información...
                    } else if (estudiante == "0") {
        
                        res.status(500).json({
                            ok: false,
                            mensaje: 'Usuario incorrecto'
                        });
                
                    } else {
                        // Comprobamos que el estudiante pertenezca a la facultad de ingeniería
                        // Si no hace parte...
                        if (FacuIngenieria.indexOf(estudiante.programa) < 0) {
        
                            res.status(500).json({        
                                ok: false,
                                mensaje: 'Lo sentimos, usted no pertenece a la Facultad de Ingeniería'
                            });
        
                        } else {
                            // Buscamos el programa de la base de datos de mongo con respecto al programa
                            // del serviciopara asignarle el id al estudiante
                            Programa.findOne({ "nombre": estudiante.programa }, (err, programa) => {
        
                                if (err) {
                                    console.log(err);
        
                                } else {
        
                                    // Si hace parte, se crea un objeto de tipo Estudiante, para guardarlo en mongo
                                    var mongoEstudiante = new Estudiante({
        
                                        codigo: estudiante.codigo,
                                        identificacion: estudiante.identificacion,
                                        nombres: estudiante.nombres,
                                        apellidos: estudiante.apellidos,
                                        correo: estudiante.correo,
                                        telefono: estudiante.telefono,
                                        programa: programa._id,
                                        creditos_aprobados: estudiante.creditos_aprobados,
                                        modGrado: estudiante.modGrado,
                                        imagen: estudiante.imagen,
                                        usuario: estudiante.usuario,
                                        contraseña: estudiante.contraseña,
                                        rol: estudiante.rol,
                                        modalidad: null,
                                        eps: null
        
                                    });
        
        
                                    // Pero antes de guardarlo, se comprueba si existe en mongo
                                    Estudiante.find({ 'codigo': estudiante.codigo }, (err, estudianteEncotrado) => {
        
        
                                        if (estudianteEncotrado.length > 0) {
                                            console.log("El estudiante ya existe");
        
                                        } else {
        
                                            // Si no existe, que se guarde
                                            mongoEstudiante.save((err, estudianteGuardado) => {
        
                                                if (err) {
                                                    console.log(err);
                                                } else {
                                                    console.log('Guardado: ' + estudianteGuardado);
                                                }
                                            });
                                        }
                                    });
        
                                }
                            });
        
                            // Establecemos un tiempo de espera para leer el estudiante que se acaba de registrar
                            // en la BD (o no)
                            setTimeout(() => {
        
                                // Buscamos el estudiante por el usuario
                                Estudiante.findOne({ usuario: usuario })
                                    .populate('programa')
                                    .populate('modalidad')
                                    .exec((err, estudianteEncotrado) => {
        
                                        if (err) {
        
                                            res.status(500).json({
        
                                                ok: false,
                                                mensaje: 'Lo sentimos, hubo un problema en el servidor'
                                            });
        
        
                                            // Comparamos las contraseñas, si no son iguales...
                                        } else if (!bcrypt.compareSync(contrasena, estudianteEncotrado.contraseña)) {
        
                                            res.status(500).json({
        
                                                ok: false,
                                                mensaje: 'Contraseña Incorrecta'
        
                                            });
        
        
                                            // Si todo sale bien...
                                        } else {
        
                                            // Se crea un token para validar la autenticacíon del estudiante
                                            var token = jwt.sign({ usuario: estudianteEncotrado }, SEED, { expiresIn: 999999999999 });
        
                                            estudianteEncotrado.contraseña = ":)"
        
                                            // Finalmente se hace una respuesta, con la info del estudiante y el token
                                            res.status(200).json({
                                                ok: true,
                                                mensaje: "Login Correcto",
                                                token: token,
                                                estudiante: estudianteEncotrado
        
                                            });
        
                                        }
        
                                    });
        
                                // Definimos un tiempo de 0.5 segundos
                            }, 500);
                        }
                    }
                });
            }
            }
        });
        

        // Si no es estudiante, es administrativo :v --> Parte administrativo
    } else {
        // Accedemos al servicio que regresa los administrativos enviando el usuario
        Administrativo.findOne({ usuario: usuario }).populate('programa').exec((err, adminEncontrado) => {

            if (err) {
                res.status(500).json({
                    ok: false,
                    mensaje: 'Lo sentimos, hubo un problema en el servidor'
                });
            } else{

                if(adminEncontrado != null){
                    // Comparamos las contraseñas, si no son iguales...
                    if (!bcrypt.compareSync(contrasena, adminEncontrado.contraseña)) {

                        res.status(500).json({
                            ok: false,
                            mensaje: 'Contraseña Incorrecta'
                        });
                    // Finalmente si todo sale bien...
                    } else {
                    // Se crea un token para validar la autenticacíon del administrativo
                        var token = jwt.sign({ usuario: adminEncontrado }, SEED, { expiresIn: 999999999999 });

                        adminEncontrado.contraseña = ":)"

                        // Finalmente se hace una respuesta, con la info del administrativo y el token
                        res.status(200).json({
                            ok: true,
                            mensaje: "Login Correcto",
                            token: token,
                            administrativo: adminEncontrado
                        });
                    }
                }else{
                    EncargadoEmpresa.findOne({ identificacion: usuario }).populate('empresa').populate('programa').exec((err, EncargadoEmpresaEncontrado) => {
                        if (err) {
                            res.status(500).json({
                                ok: false,
                                mensaje: 'Lo sentimos, hubo un problema en el servidor'
                            });
                        } else{

                            if(EncargadoEmpresaEncontrado != null){
                                // Comparamos las contraseñas, si no son iguales...
                                if (!bcrypt.compareSync(contrasena, EncargadoEmpresaEncontrado.contraseña)) {
                                    res.status(500).json({
                                        ok: false,
                                        mensaje: 'Contraseña Incorrecta'
                                    });
                                // Finalmente si todo sale bien...
                                } else {
                                // Se crea un token para validar la autenticacíon del administrativo
                                    var token = jwt.sign({ usuario: EncargadoEmpresaEncontrado }, SEED, { expiresIn: 999999999999 });
            
                                    EncargadoEmpresaEncontrado.contraseña = ":)"
            
                                    // Finalmente se hace una respuesta, con la info del administrativo y el token
                                    res.status(200).json({
                                        ok: true,
                                        mensaje: "Login Correcto",
                                        token: token,
                                        encargadoEmpresa: EncargadoEmpresaEncontrado
                                    });
                                }
                            }else{
                                Request.get(`http://localhost:5000/administrativo/${API_KEY_ADMINISTRATIVOS}/${usuario}`, (err, info, administrativo) => {

                                    // Convertimos la respuesta en Json
                                    var administrativo = JSON.parse(administrativo);
                        
                                    if (err) {
                        
                                        res.status(500).json({
                        
                                            ok: false,
                                            mensaje: 'Error en el servidor'
                                        });
                        
                        
                                        // Si no encontró información...
                                    } else if (administrativo == "0") {
                        
                                        res.status(500).json({
                        
                                            ok: false,
                                            mensaje: 'Usuario incorrecto'
                                        });
                        
                        
                                        // Se comparan las contraseñas, si no coinciden...
                                    } else {
                        
                                        // Comprobamos que el administrativo pertenezca a la facultad de ingeniería
                                        // Si no hace parte...
                                        if (FacuIngenieria.indexOf(administrativo.programa) < 0) {
                        
                                            res.status(500).json({
                        
                                                ok: false,
                                                mensaje: 'Lo sentimos, usted no pertenece a la Facultad de Ingeniería'
                                            });
                        
                                        } else {
                        
                                            // Buscamos el programa de la base de datos de mongo con respecto al programa
                                            // del servicio para asignarle el id al administrativo
                                            Programa.findOne({ "nombre": administrativo.programa }, (err, programa) => {
                        
                                                if (err) {
                                                    console.log(err);
                        
                                                } else {
                        
                        
                                                    // Si hace parte, se crea un objeto de tipo Administrativo, para guardarlo en mongo
                                                    var mongoAdministrativo = new Administrativo({
                        
                                                        identificacion: administrativo.identificacion,
                                                        nombres: administrativo.nombres,
                                                        apellidos: administrativo.apellidos,
                                                        correo: administrativo.correo,
                                                        telefono: administrativo.telefono,
                                                        programa: programa._id,
                                                        imagen: administrativo.imagen,
                                                        usuario: administrativo.usuario,
                                                        contraseña: administrativo.contraseña,
                                                        rol: administrativo.rol
                        
                                                    });
                        
                        
                                                    // Pero antes de guardarlo, se comprueba si existe en mongo
                                                    Administrativo.find({ identificacion: administrativo.identificacion }, (err, existeAdmin) => {
                        
                        
                                                        if (existeAdmin.length > 0) {
                                                            console.log("El administrativo ya existe");
                        
                                                        } else {
                        
                                                            // Si no existe, que se guarde
                                                            mongoAdministrativo.save((err, adminGuardado) => {
                        
                                                                if (err) {
                                                                    console.log(err);
                                                                } else {
                                                                    console.log('Guardado: ' + adminGuardado);
                                                                }
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                        
                                            // Establecemos un tiempo de espera para leer el adminstrativo que se acaba de registrar
                                            // en la BD (o no)
                                            setTimeout(() => {
                        
                                                // Buscamos el administrativo por el usuario
                                                Administrativo.findOne({ usuario: usuario })
                                                    .populate('programa')
                                                    .exec((err, adminEncontrado) => {
                        
                                                        if (err) {
                        
                                                            res.status(500).json({
                        
                                                                ok: false,
                                                                mensaje: 'Lo sentimos, hubo un problema en el servidor'
                                                            });
                        
                        
                                                            // Comparamos las contraseñas, si no son iguales...
                                                        } else if (!bcrypt.compareSync(contrasena, adminEncontrado.contraseña)) {
                        
                                                            res.status(500).json({
                        
                                                                ok: false,
                                                                mensaje: 'Contraseña Incorrecta'
                        
                                                            });
                        
                        
                                                            // Finalmente si todo sale bien...
                                                        } else {
                        
                                                            // Se crea un token para validar la autenticacíon del administrativo
                                                            var token = jwt.sign({ usuario: adminEncontrado }, SEED, { expiresIn: 999999999999 });
                        
                                                            adminEncontrado.contraseña = ":)"
                        
                                                            // Finalmente se hace una respuesta, con la info del administrativo y el token
                                                            res.status(200).json({
                                                                ok: true,
                                                                mensaje: "Login Correcto",
                                                                token: token,
                                                                administrativo: adminEncontrado
                        
                                                            });
                                                        }
                                                    });
                        
                                                // Definimos un tiempo de 0.5 segundos
                                            }, 500)
                                        }
                                    }
                                });
                            }
                        }
                    });
                }
            }
        });
    }
});


module.exports = app;
