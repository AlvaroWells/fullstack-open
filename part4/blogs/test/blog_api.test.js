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

  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog)
    await blogObject.save()
  }
})

describe('Blog API', () => {
  describe('GET /api/blogs', () => {
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
  })

  describe('POST /api/blogs', () => {
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
      // console.log(response)
      newBlog = response.find(b => b.likes === undefined)
      helper.addObjectLikes(newBlog, 0)

      const likes = await helper.findLike()
      expect(likes).toBeDefined()
      expect(newBlog.likes).toBe(0)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
    })

    test('if title or url is missing, it returns 400 error', async () => {
      let newBlog = {
        title: '',
        author: 'author',
        url: '',
        likes: 12
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })
  })
  describe('DELETE /api/blogs', () => {
    test('a blog can be deleted', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd).toHaveLength(
        helper.initialBlogs.length - 1
      )

      const blogs = blogsAtEnd.map(b => b.title)

      expect(blogs).not.toContain(blogToDelete.title)
    })
  })
  describe('PUT /apli/blogs', () => {
    test('blogs likes can be updated', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]

      helper.addObjectLikes(blogToUpdate, 500)
      console.log(blogToUpdate)

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .expect(200)

      expect(blogToUpdate.likes).toBe(500)
    })
  })
})

afterAll(() => {
  mongoose.connection.close()
})

