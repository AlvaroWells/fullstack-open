const blogRouter = require('express').Router()
const Blog = require('../models/blog')


blogRouter.get('/', (request, response, next) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
    .catch(error => next(error))
})

blogRouter.post('/', (request, response, next) => {
  const body = request.body

  if (!body.title) {
    return response.status(400).json({ 
      error: 'blog missing' 
    })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  })

  blog
    .save()
    .then(savedBlog => {
      response.json(savedBlog)
    })
    .catch(error => next(error))
})

module.exports = blogRouter