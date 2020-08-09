var mongoose = require('mongoose');

var Schema = mongoose.Schema;


// Creamos el esquema de la colección estudiantes para guardar en mongo
var estudianteSchema = new Schema({

    codigo: { type: String, required: true },
    identificacion: { type: String, required: true },
    nombres: { type: String, required: true },
    apellidos: { type: String, required: true },
    correo: { type: String, required: true },
    telefono: { type: String, required: true },
    programa: { type: Schema.Types.ObjectId, required: true, ref: 'Programa' },
    creditos_aprobados: { type: Number, required: true },
    modGrado: { type: Number, required: false },
    imagen: { type: String, required: false },
    usuario: { type: String, required: true },
    eps: { type: String, required: false },
    contraseña: { type: String, required: true },
    rol: { type: String, required: true },
    modalidad: { type: Schema.Types.ObjectId, ref: "Pasantia", required: false }

});

// Exportamos el modelo
module.exports = mongoose.model('Estudiante', estudianteSchema);