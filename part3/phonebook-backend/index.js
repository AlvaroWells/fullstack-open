const express = require('express')
const app = express()
//middelware morgan
const morgan = require('morgan')
//política de cors
const cors = require('cors')

let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

//json-parser de express para poder utilizar el body del objeto request
app.use(express.json())
//formato string predefinido de morgan
// app.use(morgan(`:method :url :status :res[content-length] - :response-time ms :req[body.name]`))

//Le decimos a la app que utilize el paquete de cors
app.use(cors())

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
  res.json(persons)
})

//url con la información detallada de las personas y hora de la lista
app.get('/api/info', (req, res) => {
  const infoDate = new Date()
  const personsInfo = persons.length
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
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)
  
  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
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
  const newPerson = {
    id: generateId(),
    name: String(body.name),
    number: String(body.number)
  }
  //utilizando el método concat agregamos al array el nuevo objeto
  persons = persons.concat(newPerson)
  res.json(newPerson)
})

//funcion para generar una id
const generateId = () => {
  const randomId = Math.floor(Math.random() * 1000)
  return randomId
}



// Servidor y puerto de escucha
const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})