//importamos con el paquete mongoose la base de datos de mongodb
const mongoose = require('mongoose')
//paquete utilizado para realizar las pruebas de la aplicación
const supertest = require('supertest')
//importamos el servidor express creado y almacenado en app
const app = require('../app')
//utilizando el paquete de supertest creamos la api
const api = supertest(app)

const helper = require('./test_helper')

const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})

  let blogObject = new Blog(helper.initialBlogs[0])
  await blogObject.save()

  blogObject = new Blog(helper.initialBlogs[1])
  await blogObject.save()
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-type', /application\/json/)
}, 100000)

test('blog returns id parameter', async () => {
  const ids = await helper.findId()
  expect(ids).toBeDefined()
})

test('a new blog can be added', async () => {
  const response = await helper.blogsInDb()
  const newBlog = response[0]

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(response.length + 1)

  const titles = blogsAtEnd.map(b => b.title)
  expect(titles).toContain(
    `${newBlog.title}`
  )
})

test('if likes property is missing, it defaults to 0', async () => {
  let newBlog = {
    title: 'newblog',
    author: 'yourself',
    url: 'https://whatever.rer',
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await helper.blogsInDb()
  console.log(response)
  newBlog = response.find(b => b.likes === undefined)
  // console.log(newBlog)
  newBlog.likes = 0
  // console.log(newBlog)

  const likes = await helper.findLike()
  expect(likes).toBeDefined()
  expect(newBlog.likes).toBe(0)
})

afterAll(() => {
  mongoose.connection.close()
})

