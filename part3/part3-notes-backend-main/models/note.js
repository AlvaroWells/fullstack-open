const mongoose = require('mongoose')

const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    minlength: 5
  },
  important: Boolean,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

// Configuramos la transformación de la representación JSON de los documentos de la base de datos.
// Esto cambia la propiedad '_id' del documento a una cadena ('string') y la asigna a la propiedad 'id',
// para mantener la consistencia en la estructura de los datos enviados al frontend.
// También eliminamos las propiedades '_id' y '__v' del objeto 'returnedObject' para evitar enviar datos
// innecesarios al frontend y mejorar el rendimiento y la seguridad de la aplicación.
noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Note', noteSchema)