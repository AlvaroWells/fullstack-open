const blogRouter = require('express').Router()
const Blog = require('../models/blog')

const middleware = require('../utils/middleware')


blogRouter.get('/', async (request, response) => {
  try {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
  } catch (error) {
    console.error('Error obtaining blogs:', error.message)
  }
})
//ruta para obtener un blog según su id
blogRouter.get('/:id', async (request, response) => {
  try {
    const blog = await Blog.findById(request.params.id).populate('user', { username: 1, name: 1 })

    if (!blog) {
      return response.status(404).json({ error: 'Blog not found' })
    }
    response.status(200).json({
      id: blog._id,
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes,
      user: blog.user // Aquí solo incluimos la información básica del usuario (por ejemplo, el username)
    });
  } catch (error) {
    console.error('Error:', error.message)
    response.status(500).json({ error: 'Server error' })
  }
})

blogRouter.post('/', middleware.userExtractor, async (request, response) => {
  try {
    const body = request.body

    if (!body.title || !body.url) {
      return response.status(400).json({
        error: 'blog missing'
      })
    }
    //obtenemos el usuario con token con el middleware apartir de la request.
    const user = request.user
    //creamos el nuevo blog con el cuerpo de la solicitud. Y el id de usuario
    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      user: user.id,
      likes: body.likes
    })

    const savedBlog = await blog.save()//-> guardamos el nuevo blog en la base de datos
    //utilizamos el populate para que la respuesta al guardar el blog nos devuelva también la información del usuario
    const populatedBlog = await savedBlog.populate('user', { username: 1, name: 1, id: 1 })
    user.blogs = user.blogs.concat(populatedBlog.id)
    await user.save()

    response.status(201).json(savedBlog)
  } catch (error) {
    console.error('error:', error.message)
  }
})

// ruta para borrar un blog por id
blogRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  try {
    const user = request.user
    //guardamos la información de los ids que provienen de la base de datos
    const blog = await Blog.findById(request.params.id)
    if (!blog) {
      return response.status(404).json({ error: 'Blog not found' })
    }

    //convertimos los objetos id de la base de datos a una strig y los comparamos.
    if (blog.user.toString() === user._id.toString()) {
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
    const body = request.body;
    //el cuerpo de la solicitud al modificar el blog.
    const blog = {
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      user: body.user.id
    };

    // Actualizamos el blog y recuperamos el objeto de usuario asociado
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true }).populate('user', { username: 1, name: 1, id: 1 })

    if (!updatedBlog) {
      return response.status(404).json({ error: 'Blog not found' })
    }

    response.status(200).json(updatedBlog);
  } catch (error) {
    console.error('Error updating blog', error.message)
    response.status(500).json({ error: error.message })
  }
})


module.exports = blogRouter