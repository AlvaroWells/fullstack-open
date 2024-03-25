const logger = require('./logger')

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

// funcion para controlar solicitudes con endpoint desconocido
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

//función middleware de Express con funcionalidad de control de errores
const errorHandler = (error, request, response, next) => {
  console.error(error.message)
    
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
    
  next(error)
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler
}