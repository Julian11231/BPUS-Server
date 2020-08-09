var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var PasantiaSchema = new Schema({

    estudiante: { type: Schema.Types.ObjectId, required: true, ref: 'Estudiante', unique: true },
    modalidad: { type: Schema.Types.ObjectId, required: true, ref: 'Modalidad' },
    empresa: { type: Schema.Types.ObjectId, required: false, ref: 'Empresa' },
    vacante: { type: Schema.Types.ObjectId, required: false, ref: 'Vacante' },
    documento_propuesta: { type: String, required: false },
    estado_propuesta: { type: String, required: false },
    documento_informe7: { type: String, required: false },
    estado_informe7: { type: String, required: false },
    documento_informe14: { type: String, required: false },
    estado_informe14: { type: String, required: false },
    documento_informeFinal: { type: String, required: false },
    estado_informeFinal: { type: String, required: false },
    tutor: { type: String, required: false },
    notas: { type: String, required: false },
    estado: { type: String, required: true },
    fecha: { type: Date, required: false }

}, { collection: 'pasantias' });

// Exportamos el modelo
module.exports = mongoose.model('Pasantia', PasantiaSchema);