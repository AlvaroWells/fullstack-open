// Importación del módulo de configuración que contiene variables de entorno y configuraciones.
const config = require('./utils/config')
// Importación del framework Express para crear el servidor web.
const express = require('express')
require('express-async-errors')
// Creación de una instancia de la aplicación Express.
const app = express()
// Importación del middleware CORS para habilitar el intercambio de recursos entre diferentes orígenes.
const cors = require('cors')
// Importación del enrutador de notas desde el controlador de notas.
const notesRouter = require('./controllers/notes')
//importación del enrutador de usuarios desde el controlador de usuarios.
const usersRouter = require('./controllers/users')
// Importación de middleware personalizado para manejar ciertas operaciones comunes.
const middleware = require('./utils/middleware')
// Importación del módulo de registro para registrar mensajes.
const logger = require('./utils/logger')
// Importación del paquete Mongoose para interactuar con la base de datos MongoDB.
const mongoose = require('mongoose')

// Configuración para deshabilitar el modo estricto de consulta en Mongoose.
mongoose.set('strictQuery', false)

// Registro de un mensaje informativo indicando que se está intentando conectar a la base de datos.
logger.info('Connecting to', config.MONGODB_URI)

// Conexión a la base de datos MongoDB utilizando la URL proporcionada en la configuración.
mongoose.connect(config.MONGODB_URI)
  .then(() => {
    // Si la conexión es exitosa, se registra un mensaje de éxito.
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    // Si la conexión falla, se registra un mensaje de error con el motivo del fallo.
    logger.error('error connecting to MongoDB:', error.message)
  })

// Uso de middleware CORS para habilitar el intercambio de recursos entre diferentes orígenes.
app.use(cors())
// Uso de middleware para servir archivos estáticos desde el directorio 'dist'.
app.use(express.static('dist'))
// Uso de middleware para analizar el cuerpo de las solicitudes entrantes en formato JSON.
app.use(express.json())
// Uso de middleware personalizado para registrar detalles sobre las solicitudes entrantes.
app.use(middleware.requestLogger)

// Asignación del enrutador de notas al punto final '/api/notes'.
app.use('/api/notes', notesRouter)
// Asignación del enrutador de usuarios al endpoint '/api/users/'
app.use('/api/users', usersRouter)

// Uso de middleware personalizado para manejar solicitudes a puntos finales desconocidos.
app.use(middleware.unknownEndpoint)
// Uso de middleware personalizado para manejar errores.
app.use(middleware.errorHandler)

// Exportación de la aplicación Express configurada para su uso en otros archivos.
module.exports = app