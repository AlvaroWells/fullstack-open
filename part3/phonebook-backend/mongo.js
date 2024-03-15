const mongoose = require('mongoose')

if (process.env.lenght > 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://alvarogwells:${password}@cluster0.zxcwm3n.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url)

//El esquema que utilizaremos para guardar la información a la base de datos
const personSchema = new mongoose.Schema({ 
  name: String,
  number: String,
})

//modelo que utilizará la base de datos para guardar la información que proporcionaremos, convertirá en plural y en minúsculas el nombre de la constante
const Person = mongoose.model('Person', personSchema)

//nombre y número de teléfono que recibiremos por línea de comando para agregar a la nueva persona en la bd
const personName = process.argv[3]
const personNumber = process.argv[4]

//Los datos que almacenaremos en la base de datos de mongodb atlas
const person = new Person({
  name: personName,
  number: personNumber
})

if (personName === undefined && personNumber === undefined) {
  Person
    .find({})
    .then(result => {
      console.log("phonebook:")
      result.forEach(person => {
        console.log(
          `${person.name} ${person.number}`
        )
      })
    mongoose.connection.close()
  })
} else {
  person.save().then(result => {
    console.log(`added ${personName} number ${personNumber} to phonebook`)
    mongoose.connection.close()
  })
}

//guardamos la información proporcionada en la base de datos y cerramos la conexión.
// person.save().then(result => {
//   console.log(`added ${personName} number ${personNumber} to phonebook`)
//   // mongoose.connection.close()
// })

// Person
//   .find({})
//   .then(result => {
//     result.forEach(person => {
//       console.log(
//         `
//           phonebook:\n
//           ${person.name} ${person.number}
//         `
//       )
//     })
//   mongoose.connection.close()
// })



