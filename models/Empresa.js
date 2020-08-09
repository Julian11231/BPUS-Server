var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var empresaSchema = new Schema({

    programa: { type: Schema.Types.ObjectId, required: true, ref: 'Programa' },
    nombre: { type: String, required: true },
    direccion: { type: String, required: true },
    telefono: { type: String, required: true },
    naturaleza: { type: String, required: true },
    actividad_economica: { type: String, required: true },
    nombre_persona: { type: String, required: true },
    cargo_persona: { type: String, required: true },
    correo_persona: { type: String, required: true },
    telefono_persona: { type: String, required: true },
    //imagen: { type: String, required: false },
    estado: { type: String, required: true }

}, { collection: 'empresas' });

module.exports = mongoose.model('Empresa', empresaSchema);