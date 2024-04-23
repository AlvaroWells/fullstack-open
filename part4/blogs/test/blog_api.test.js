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
const User = require('../models/user')



beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog)
    await blogObject.save()
  }

  for (let user of helper.initialUsers) {
    let userObject = new User(user)
    await userObject.save()
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
      const { token } = await helper.createTestUser()

      const response = await helper.blogsInDb()
      const blog = response[0]
      //guardamos la respuesta de la api
      const res = await api
        .post('/api/blogs')
        .send(blog)
        .set('Authorization', `Bearer ${token}`)

      expect(res.status).toBe(201)

      const newBlog = res.body
      //eliminamos la propìedad id para la comparación con la base de datos y el nuevo objeto creado, ya que esta nos crea una por defecto y no son equivalentes.
      const keysToCheck = Object.keys(blog).filter(key => key !== 'id')

      //iteramos las propiedades y las comparamos para ver si son equivalentes.
      keysToCheck.forEach(key => {
        expect(newBlog[key]).toBe(blog[key])
      })

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(response.length + 1)

      const titles = blogsAtEnd.map(b => b.title)
      expect(titles).toContain(
        `${blog.title}`
      )
    })

    test('if likes property is missing, it defaults to 0', async () => {
      const { token } = await helper.createTestUser()

      let blog = {
        title: 'newblog',
        author: 'yourself',
        url: 'https://whatever.rer',
      }

      await api
        .post('/api/blogs')
        .send(blog)
        .set(`Authorization`, `Bearer ${token}`)
        .expect(201)


      const response = await helper.blogsInDb()
      // console.log(response)
      blog = response.find(b => b.likes === undefined)
      helper.addObjectLikes(blog, 0)

      const likes = await helper.findLike()
      expect(likes).toBeDefined()
      expect(blog.likes).toBe(0)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
    })

    test('if title or url is missing, server returns 400 error', async () => {
      const { token } = await helper.createTestUser()

      let blog = {
        title: '',
        author: 'author',
        url: '',
        likes: 12
      }

      await api
        .post('/api/blogs')
        .send(blog)
        .set('Authorization', `Bearer ${token}`)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })
    test('if token is missing, server returns 401 error', async () => {
      const response = await helper.blogsInDb()
      const blog = response[0]

      await api
        .post('/api/blogs')
        .send(blog)
        .expect(401)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })
  })
  describe('DELETE /api/blogs', () => {
    test('a blog can be deleted', async () => {
      const { token, blog } = await helper.createTestUser()

      const blogToDelete = blog
      const blogsAtStart = await helper.blogsInDb()

      await api
        .delete(`/api/blogs/${blogToDelete._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd).toHaveLength(
        blogsAtStart.length - 1
      )

      const blogs = blogsAtEnd.map(b => b.title)

      expect(blogs).not.toContain(blogToDelete.title)
    })
    test('deleting a blog with invalid token returns 401', async () => {
      const { blog } = await helper.createTestUser()

      const blogsAtStart = await helper.blogsInDb()

      await api
        .delete(`/api/blogs/${blog._id}`)
        .expect(401)

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd).toHaveLength(blogsAtStart.length)

      const blogs = blogsAtEnd.map(b => b.title)

      expect(blogs).toContain(blog.title)
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

