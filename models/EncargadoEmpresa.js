var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Creamos el esquema de la colección encargados de la empresa para guardar en mongo
var EncargadoEmpresaSchema = new Schema({

    identificacion: { type: String, required: true, unique: true },
    nombre: { type: String, required: true },
    correo: { type: String, required: true, unique: true },
    telefono: { type: String, required: true },
    imagen: { type: String, required: false },
    contraseña: { type: String, required: true },
    empresa: { type: Schema.Types.ObjectId, required: true, ref: 'Empresa' },
    programa: { type: Schema.Types.ObjectId, required: true, ref: 'Programa' },
    cargo: { type: String, required: true }, 
    rol: { type: String, required: true },
    estado: {type: String, required: true}

});

// Exportamos el modelo
module.exports = mongoose.model('EncargadoEmpresa', EncargadoEmpresaSchema);