// FUNCIONES Y ARRAY PARA TESTING APP BLOGS
const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: 'Endless Story',
    author: 'Myself',
    url: 'https://endlessStory.rer',
    likes: 222
  },
  {
    title: 'Mario & cia',
    author: 'Mario itself',
    url: 'https://marioSelf.es',
    likes: 15
  }
]

const nonExistingId = async () => {
  const blog = new Blog({ content: 'willremovethissoon' })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}
//funcion que devuelve los blogs de la base de datos de prueba
const blogsInDb = async () => {
  const blog = await Blog.find({})
  return blog.map(blog => blog.toJSON())
}
//función que devuelve las ids de la base de datos de prueba
const findId = async () => {
  const response = await blogsInDb()
  const id = response.map(r => r.id)
  return id
}
//funcion que devuelve el valor de la propiedad likes
const findLike = async () => {
  const response = await blogsInDb()
  const likes = response.map(r => r.likes)
  return likes
}
//funcion para crear una propiedad de likes a un objeto
function addObjectLikes(obj, likes) {
  obj.likes = likes;
}

//FUNCIONES Y ARRAY/OBJETOS PARA TESTING DE LOS USUARIOS EN APP BLOGS

const User = require('../models/user')
const jwt = require('jsonwebtoken')

const initialUsers = [
  {
    username: "JIMERO12",
    password: "12345",
    name: "JIMERO Almenárez"
  },
  {
    username: "POPOTO1234",
    password: "12341",
    name: "MARIA UNPAJOTE"
  }
]
//funcion para recuperar los usuarios de la base de datos
const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

const createTestUser = async () => {
  const user = new User({
    username: 'testuser',
    password: '12345',
    name: 'testname'
  })
  //guardamos el usuario
  await user.save()
  //generamos el token, le pasamos como parámetro el objeto id
  const token = jwt.sign({ id: user._id }, process.env.SECRET)

  return { user, token }
}


module.exports = {
  nonExistingId,
  blogsInDb,
  findId,
  initialBlogs,
  findLike,
  addObjectLikes,
  initialUsers,
  usersInDb,
  createTestUser
}
