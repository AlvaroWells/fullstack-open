//importamos mongoose
const mongoose = require('mongoose')
const assert = require('assert')

// Deshabilitar el modo estricto de consulta en Mongoose para permitir la creación de propiedades adicionales en documentos.
mongoose.set('strictQuery', false)

//almacenamos dentro de la variable la contraseña como variable de entorno
const url = process.env.MONGODB_URI

console.log('connecting to', url)

//nos conectamos a la url de la base de datos
mongoose
  .connect(url)
  .then(result => {
    console.log(result, 'connected to MongoDB')
  })
  .catch((e) => {
    console.log('error connecting to MongoDB:', e.message)
  })

//El esquema que utilizaremos para guardar la información a la base de datos
// const personSchema = new mongoose.Schema({
//   name: String,
//   number: String,
// })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [3, `{VALUE} is too short`],
    maxLength: [],
    // required: true
  },
  number: {
    type: String,
    validate: {
      validatorOne: function(v) {
        return /\d{3}-\d{8}/.test(v)
      },
      messageOne: props => `${props.value} is not a valid phone number`,
      validatorTwo: function(v) {
        return /\d{2}-\d{7}/.test(v)
      },
      messageTwo: props => `${props.value} is not a valid phone number`
    },
    required: [true, "User phone number is required"]
  }
})

const Person = mongoose.model('Person', personSchema)
const person = new Person()
let error

person.number = '555.0123'
error = person.validateSync()
assert.equal(error.errors['number'].message,
  '555.0123 is not a valid phone number')

person.number = ''
error = person.validateSync()
assert.equal(error.errors['number'].message,
  'User phone number is required')

person.number = '203-55012312'
error = person.validateSync()
assert.equal(error, null)

person.number = '20-5501231'
error = person.validateSync()
assert.equal(error, null)

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
module.exports = mongoose.model('Person', personSchema)