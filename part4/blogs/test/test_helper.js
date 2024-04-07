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

module.exports = {
  nonExistingId, blogsInDb, findId, initialBlogs, findLike, addObjectLikes
}