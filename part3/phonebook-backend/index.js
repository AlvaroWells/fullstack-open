const express = require('express')
//importamos las variables de entorno
//política de cors
const cors = require('cors')
require('dotenv').config()
const app = express()
//middelware morgan
const morgan = require('morgan')
//importamos el modulo Person
const Person = require('./modules/person')

let persons = [
]

//json-parser de express para poder utilizar el body del objeto request
app.use(express.json())
//formato string predefinido de morgan
// app.use(morgan(`:method :url :status :res[content-length] - :response-time ms :req[body.name]`))

//Le decimos a la app que utilize el paquete de cors
app.use(cors())

//para mostrar el contenido estatico de la aplicación utilizamos la siguiente línea
app.use(express.static('dist'))

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
  ].join(' ') 
}))

app.get('/', (req, res) => {
  res.send('<h1>Backend API persons phonebook</h1>')
})

//url de la informacion del objeto
app.get('/api/persons', (req, res) => {
  Person
    .find({})
    .then(persons => {
      console.log(persons)
      res.json(persons)
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
app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)

  res.status(204).end()
})


//petición post de nuevas entries al servidor
app.post('/api/persons', (req, res) => {
  const body = req.body
  // console.log(body)
  
  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'name or number missing'
    })
  }
  //utilizando el metodo some si cumple la condicion se agrega a la constante nameExists
  const nameExists = persons.some(person => person.name.toLocaleLowerCase() === body.name.toLocaleLowerCase())
  
  //si existe algún nombre repetido nos devuelve un error
  if (nameExists) {
    return res.status(400).json({
      error: 'name must be unique'
    })
  }
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
})

//funcion para generar una id
// const generateId = () => {
//   const randomId = Math.floor(Math.random() * 1000)
//   return randomId
// }



// Servidor y puerto de escucha
const PORT =  process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})