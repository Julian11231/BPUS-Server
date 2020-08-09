var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// Creamos el esquema de la colección administrativos para guardar en mongo
var administrativoSchema = new Schema({

    identificacion: { type: String, required: true },
    nombres: { type: String, required: true },
    apellidos: { type: String, required: true },
    correo: { type: String, required: true },
    telefono: { type: String, required: true },
    programa: { type: Schema.Types.String, required: true, ref: 'Programa' },
    imagen: { type: String, required: false },
    usuario: { type: String, required: true },
    contraseña: { type: String, required: true },
    rol: { type: String, required: true }

});


// Exportamos el modelo
module.exports = mongoose.model('Administrativo', administrativoSchema);
