const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')


//ruta GET endpoint /api/users
usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs') //añadimos la unión entre base de datos y usuarios con el método populate de mongoose

  response.json(users)
})
//ruta post endpoint /api/users
usersRouter.post('/', async (request, response) => {
  const { username, password, name } = request.body

  const usersInDb = await User.find({})
  const userExist = usersInDb.some(u => u.username === username)

  //Validación longitud de nombre usuario
  if (username.length < 3 || username.lenth > 20) {
    return response.status(400).json({ error: 'El nombre de usuario debe tener entre 3 y 20 carácteres de longitud' })
  }
  //Validación de carácteres especiales
  const validUsernameRegex = /^[a-zA-Z0-9_-]+$/
  if (!validUsernameRegex.test(username)) {
    return response.status(400).json({ error: 'El nombre de usuario sólo puede contener letras, números, guiones bajos y guiones.' })
  }
  //Validación de contraseña
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()-_+=])[0-9a-zA-Z!@#$%^&*()-_+=]{8,}$/
  const isValidPassword = passwordRegex.test(password)

  if (!isValidPassword) {
    return response.status(400).json({ error: 'La contraseña debe contener almenos 8 carácteres de longitud, una minúscula, una mayúscula, un dígito y un carácter especial,  ej: @%$...' })
  }

  if (userExist) {
    return response.status(400).json({ error: 'username must be unique' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    passwordHash,
    name,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

module.exports = usersRouter

