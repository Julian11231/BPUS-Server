var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var vacantesSchema = new Schema({

    titulo: { type: String, required: true },
    funciones: { type: String, required: true },
    descripcion: { type: String, required: true },
    empresa: { type: Schema.Types.ObjectId, ref: 'Empresa', required: true },
    programa: { type: Schema.Types.ObjectId, ref: 'Programa', required: true },
    encargado: { type: Schema.Types.ObjectId, ref: 'EncargadoEmpresa', required: true },
    ubicacion: { type: String, required: true },
    modalidad: { type: String, required: true },
    cantidad: { type: Number, required: true },
    pagada: { type: String, required: true },
    letra: { type: String, required: true },
    estado: { type: String, required: true }

}, { collection: 'vacantes' });

module.exports = mongoose.model('Vacante', vacantesSchema);
