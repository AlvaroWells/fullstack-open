const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const helper = require('./test_helper')

const User = require('../models/user')

beforeEach(async () => {
  await User.deleteMany({})

  for (let user of helper.initialUsers) {
    let userObject = new User(user)
    await userObject.save()
  }
})


describe('test for new users in blog api', () => {
  test('GET /api/users, get information of the users in the database', async () => {
    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('POST /api/users, add a new user to the database', async() => {
    const response = await helper.usersInDb()

    const newUser = {
      username: "ROMAN12",
      password: "123452",
      name: "RAMON JOMAN"
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(response.length + 1)
  })

  test('POST /api/users, if the user is incorrect server responds with an error 400', async () => {
    const newUser = {
      username: "Us",
      password: "1",
      name: "JIMERO Almenárez"
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(helper.initialUsers.length)
  })
})


afterAll(() => {
  mongoose.connection.close()
})