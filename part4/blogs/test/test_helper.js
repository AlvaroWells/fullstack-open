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
//funcion que devuelve las
const blogsInDb = async () => {
  const blog = await Blog.find({})
  return blog.map(blog => blog.toJSON())
}
//función que devuelve las ids de la base de datos
const findId = async () => {
  const response = await blogsInDb()
  const id = response.map(r => r.id)
  return id
}

module.exports = {
  nonExistingId, blogsInDb, findId, initialBlogs
}