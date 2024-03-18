//lineas de importación de librerías JS
//express para crear el servidor
const express = require('express')
//cors para las políticas middleware
const cors = require('cors')
//variables de entorno
require('dotenv').config()
//nombre de la aplicación
const app = express()
//importamos el módulo Note
const Note = require('./models/note')

let notes = [
]

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

//funcion para generar una nueva id de las notas
// const generateId = () => {
//   const maxId = notes.length > 0
//     ? Math.max(...notes.map(n => n.id))
//     : 0
//   return maxId + 1
// }

//métodos get
app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (req, res) => {
  Note
    .find({})
    .then(notes => {
      console.log(notes)
      res.json(notes)
    })
})

app.get('/api/notes/:id', (request, response) => {
  Note
    .findById(request.params.id)
    .then(note => {
      response.json(note)
    })
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
app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)

  response.status(204).end()
})


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

