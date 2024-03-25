const express = require('express')
const app = express()
require('dotenv').config()

const Person = require('./modules/person')

//para mostrar el contenido estatico de la aplicación utilizamos la siguiente línea
app.use(express.static('dist'))

const cors = require('cors')

app.use(cors())
app.use(express.json())

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(requestLogger)

//función middleware de Express con funcionalidad de control de errores
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

// funcion para controlar solicitudes con endpoint desconocido
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

//nombre y número de teléfono que recibiremos por 'línea de comando' para agregar a la nueva persona en la bd
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
    // mongoose.connection.close()
    })
} else {
  person
    .save()
    .then(result => {
      console.log(result, `added ${personName} number ${personNumber} to phonebook`)
      // mongoose.connection.close()
    })
}

const morgan = require('morgan')

//middleware para registrar el cuerpo de la solicitud
app.use((req, res, next) => {
  //almacena el cuerpo de la solicitud en una propiedad personalizada
  req.logData = req.body
  next()
})

//Utilizamos Morgan con un formato personalizado que incluya el cuerpo de la solicitud
app.use(morgan((tokens, req, res) => {
  //accedemos al cuerpoo de la solicitud almacenado en la propiedad solicitada
  const bodyData = req.logData
    ? JSON.stringify(req.logData)
    : ''
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'),
    '-',
    tokens['response-time'](req, res),
    'ms',
    //aquí agregamos el cuerpo de la solicitud al registro
    bodyData
  ]
    .join(' ')
}))

app.get('/', (req, res) => {
  res.send('<h1>Backend API persons phonebook</h1>')
})

//url de la informacion del objeto
app.get('/api/persons', (req, res) => {
  Person
    .find({})
    .then(people => {
      console.log(people)
      res.json(people)
    })
})

//url con la información detallada de las personas y hora de la lista
app.get('/api/info', (req, res) => {
  const infoDate = new Date()
  const personsInfo = Person.length
  res.send(
    `
      <p>Phonebook has info for ${personsInfo} people
      </br>
      <p>${infoDate}</p
    `
  )
})

//url con la información detallada de una entry
app.get('/api/persons/:id', (req, res) => {
  Person
    .findById(req.params.id)
    .then(person => {
      res.json(person)
    })
})

//petición delete al servidor
app.delete('/api/persons/:id', (req, response, next) => {
  Person
    .findByIdAndDelete(req.params.id)
    .then(result => {
      console.log(result)
      response.status(204).end()
    })
    .catch(error => next(error))
})

//petición post de nuevas entries al servidor
app.post('/api/persons', (req, res, next) => {
  const body = req.body

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'name or number missing'
    })
  }
  // //utilizando el metodo some si cumple la condicion se agrega a la constante nameExists
  // const nameExists = persons.some(person => person.name.toLocaleLowerCase() === body.name.toLocaleLowerCase())

  // //si existe algún nombre repetido nos devuelve un error
  // if (nameExists) {
  //   return res.status(400).json({
  //     error: 'name must be unique'
  //   })
  // }
  //creamos la nueva persona para agregar al array
  const newPerson = new Person({
    name: String(body.name),
    number: String(body.number)
  })
  //utilizando el método concat agregamos al array el nuevo objeto
  newPerson
    .save()
    .then(savedPerson => {
      res.json(savedPerson)
    })
    .catch(error => next(error))
})

//método put para hacer cambios desde el backend
app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body

  // const person = {
  //   name: body.name,
  //   number: body.number,
  // }

  Person
    .findByIdAndUpdate(
      req.params.id,
      { name, number },
      { new: true, runValidators: true, context: 'query' }
    )
    .then(updatedPerson => {
      res.json(updatedPerson)
    })
    .catch(error => next(error))
})

// controlador de solicitudes con endpoint desconocido
app.use(unknownEndpoint)
// controlador de solicitudes con errores del cliente
app.use(errorHandler)

// Servidor y puerto de escucha
const PORT =  process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})