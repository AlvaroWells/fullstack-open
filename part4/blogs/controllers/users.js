const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')


//ruta GET endpoint /api/users
usersRouter.get('/', async (request, response) => {
  const users = await User.find({})
  response.json(users)
})
//ruta post endpoint /api/users
usersRouter.post('/', async (request, response) => {
  const { username, password, name } = request.body

  const usersInDb = await User.find({})
  const userExist = usersInDb.some(u => u.username === username)

  if (!username || !password) {
    return response.status(400).json({ error: 'username and password are required.' })
  } else if (username.length && password.length < 3) {
    return response.status(400).json({ error: 'username and password minimum are three characters' })
  } else if (userExist) {
    return response.status(400).json({ error: 'username must be unique' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    passwordHash,
    name,
  })

  const savedUser = user.save()

  response.status(201).json(savedUser)
})

module.exports = usersRouter

