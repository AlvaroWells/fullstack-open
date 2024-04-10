//importamos librería bcrypt
const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

// Ruta GET para obtener los uruarios de la base de datos
usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({}).populate('notes', { content: 1, important: 1 })

  response.json(users)
})

//ruta POST para agregar nuevos usuarios con sus respectivas validaciones.
usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

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

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

module.exports = usersRouter