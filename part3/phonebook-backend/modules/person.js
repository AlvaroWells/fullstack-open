//importamos mongoose
const mongoose = require('mongoose')

// Deshabilitar el modo estricto de consulta en Mongoose para permitir la creación de propiedades adicionales en documentos.
mongoose.set('strictQuery', false) 

//almacenamos dentro de la variable la contraseña como variable de entorno
const url = process.env.MONGODB_URI

console.log('connecting to', url)

//nos conectamos a la url de la base de datos
mongoose
  .connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((e) => {
    console.log('error connecting to MongoDB:', e.message)
  })

//El esquema que utilizaremos para guardar la información a la base de datos
const personSchema = new mongoose.Schema({ 
  name: String,
  number: String,
})

// Configuramos la transformación de la representación JSON de los documentos de la base de datos.
// Esto cambia la propiedad '_id' del documento a una cadena ('string') y la asigna a la propiedad 'id',
// para mantener la consistencia en la estructura de los datos enviados al frontend.
// También eliminamos las propiedades '_id' y '__v' del objeto 'returnedObject' para evitar enviar datos
// innecesarios al frontend y mejorar el rendimiento y la seguridad de la aplicación.
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

//modelo que utilizará la base de datos para guardar la información que proporcionaremos, convertirá en plural y en minúsculas el nombre de la constante
// const Person = mongoose.model('Person', personSchema)

// //nombre y número de teléfono que recibiremos por línea de comando para agregar a la nueva persona en la bd
// const personName = process.argv[3]
// const personNumber = process.argv[4]

// //Los datos que almacenaremos en la base de datos de mongodb atlas
// const person = new Person({
//   name: personName,
//   number: personNumber
// })

// if (personName === undefined && personNumber === undefined) {
//   Person
//     .find({})
//     .then(result => {
//       console.log("phonebook:")
//       result.forEach(person => {
//         console.log(
//           `${person.name} ${person.number}`
//         )
//       })
//     mongoose.connection.close()
//   })
// } else {
//   person.save().then(result => {
//     console.log(`added ${personName} number ${personNumber} to phonebook`)
//     mongoose.connection.close()
//   })
// }

module.exports = mongoose.model('Person', personSchema)