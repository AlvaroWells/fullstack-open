const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  likes: Number
})

// Configuramos la transformación de la representación JSON de los documentos de la base de datos.
// Esto cambia la propiedad '_id' del documento a una cadena ('string') y la asigna a la propiedad 'id',
// para mantener la consistencia en la estructura de los datos enviados al frontend.
// También eliminamos las propiedades '_id' y '__v' del objeto 'returnedObject' para evitar enviar datos
// innecesarios al frontend y mejorar el rendimiento y la seguridad de la aplicación.
blogSchema.set('toJSON', {
  transform: (document, returdedObject) => {
    returdedObject.id = returdedObject._id.toString()
    delete returdedObject._id
    delete returdedObject.__v
  }
})

const Blog = mongoose.model('Blog', blogSchema)

module.exports = Blog