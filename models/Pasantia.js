var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var PasantiaSchema = new Schema({

    estudiante: { type: Schema.Types.ObjectId, required: true, ref: 'Estudiante', unique: true },
    modalidad: { type: Schema.Types.ObjectId, required: true, ref: 'Modalidad' },
    aprobacionEmpresa: { type: Boolean, required: true, default: false },
    empresa: { type: Schema.Types.ObjectId, required: false, ref: 'Empresa' },
    vacante: { type: Schema.Types.ObjectId, required: false, ref: 'Vacante' },
    tutor: { type: Schema.Types.ObjectId, required: false, ref: 'Administrativo' },

    documento_propuesta: { type: String, required: false },
    documento_fichaAcademica: { type: String, required: false },
    estado_propuesta: { type: String, required: false },
    notas_propuesta: { type: String, required: false },

    documento_informe7: { type: String, required: false },
    estado_informe7: { type: String, required: false },
    notas_informe7: { type: String, required: false },

    documento_informe14: { type: String, required: false },
    estado_informe14: { type: String, required: false },
    notas_informe14: { type: String, required: false },

    documento_informeFinal: { type: String, required: false },
    estado_informeFinal: { type: String, required: false },
    notas_informeFinal: { type: String, required: false },

    estado: { type: String, required: false },
    fecha: { type: Date, required: false }

}, { collection: 'pasantias' });

// Exportamos el modelo
module.exports = mongoose.model('Pasantia', PasantiaSchema);