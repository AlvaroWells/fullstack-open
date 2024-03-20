const express = require('express')
const app = express()
require('dotenv').config()

const Note = require('./models/note')

app.use(express.static('dist'))

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

//función middleware de Express con funcionalidad de control de errores
const errorHandler = (error, request, response, next) => {
  console.error(error.message)
    
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
    
  next(error)
}

const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use(requestLogger)

// funcion para controlar solicitudes con endpoint desconocido
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

//métodos get
app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (req, res) => {
  Note
    .find({})
    .then(notes => {
      // console.log(notes)
      res.json(notes)
    })
})

app.get('/api/notes/:id', (request, response, next) => {
  Note
    .findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

//metodo post
app.post('/api/notes', (request, response) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  note
    .save()
    .then(savedNote => {
      response.json(savedNote)
    })
})

//metodo delete
app.delete('/api/notes/:id', (request, response, next) => {
  Note
    .findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

//método put
app.put('/api/notes/:id', (req, res, next) => {
  const body = req.body

  const note = {
    content: body.content,
    important: body.important,
  }

  Note
    .findByIdAndUpdate(req.params.id, note, { new: true })
    .then(updatedNote => {
      res.json(updatedNote)
    })
    .catch(error => next(error))
})

// controlador de solicitudes con endpoint desconocido
app.use(unknownEndpoint)
// controlador de solicitudes con errores del cliente
app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

