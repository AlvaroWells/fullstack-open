//importamos con el paquete mongoose la base de datos de mongodb
const mongoose = require('mongoose')
//paquete utilizado para realizar las pruebas de la aplicación
const supertest = require('supertest')
//importamos el servidor express creado y almacenado en app
const app = require('../app')
//utilizando el paquete de supertest creamos la api
const api = supertest(app)

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-type', /application\/json/)
}, 100000)

afterAll(() => {
  mongoose.connection.close()
})
