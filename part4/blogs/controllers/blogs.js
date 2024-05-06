const blogRouter = require('express').Router()
const Blog = require('../models/blog')

const middleware = require('../utils/middleware')


blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })

  response.json(blogs)
})
//ruta para obtener un blog según su id
blogRouter.get('/:id', async (request, response) => {
  try {
    const blog = await Blog.findById(request.params.id).populate('user', { username: 1, name: 1 })
    if (!blog) {
      return response.status(404).json({ error: 'Blog not found' })
    }
    response.json(blog)
  } catch (error) {
    console.error('Error:', error.message)
    response.status(500).json({ error: 'Server error' })
  }
})

blogRouter.post('/', middleware.userExtractor, async (request, response) => {
  const body = request.body

  if (!body.title || !body.url) {
    return response.status(400).json({
      error: 'blog missing'
    })
  }
  //obtenemos el usuario con token con el middleware apartir de la request.
  const user = request.user

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    user: user._id,
    likes: body.likes
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

// ruta para borrar un blog por id
blogRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  try {
    const user = request.user
    console.log('User:', user)
    //guardamos la información de los ids que provienen de la base de datos
    const blog = await Blog.findById(request.params.id)
    console.log('blog', blog)
    if (!blog) {
      return response.status(404).json({ error: 'Blog not found' })
    }
    //convertimos los objetos id de la base de datos a una strig y los comparamos.
    if (blog.user.toString() === user.id.toString()) {
      await Blog.findByIdAndDelete(request.params.id)
      response.status(204).end()
    } else {
      return response.status(401).json({ error: 'You are not authorized to delete this blog' })
    }
  } catch (error) {
    console.error('Error', error.message)
    response.status(500).json({ error: error.message })
  }
})


//ruta put para actualizar los likes
blogRouter.put('/:id', async (request, response) => {
  try {
    const body = request.body

    const blog = {
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes
    }

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    response.status(200).json(updatedBlog)
  } catch (exception) {
    console.error(exception)
  }
})



module.exports = blogRouter