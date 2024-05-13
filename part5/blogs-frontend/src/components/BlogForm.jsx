import { useState } from 'react'
import PropTypes from 'prop-types'

export const BlogForm = ({ createBlog }) => {
  const [newBlogTitle, setNewBlogTitle] = useState('')
  const [newBlogAuthor, setNewBlogAuthor] = useState('')
  const [newBlogUrl, setNewBlogUrl] = useState('')

  const addBlog = async (event) => {
    event.preventDefault()
    //llamamos a la funcion que pasamos por props con los datos almecenados apartir de los eventos.
    createBlog({
      title: newBlogTitle,
      author: newBlogAuthor,
      url: newBlogUrl,
      likes: 0
    })
    //reseteamos los valores del input del formulario
    setNewBlogTitle('')
    setNewBlogAuthor('')
    setNewBlogUrl('')
  }

  return (
    <>
      <h3>Create new</h3>
      <form onSubmit={addBlog}>
        <div>
          title:
          <input
            type='text'
            name='title'
            value={newBlogTitle}
            onChange={event => setNewBlogTitle(event.target.value)}
          />
        </div>
        <div>
          author:
          <input
            type='text'
            name='author'
            value={newBlogAuthor}
            onChange={event => setNewBlogAuthor(event.target.value)}
          />
        </div>
        <div>
          url:
          <input
            type='text'
            name='url'
            value={newBlogUrl}
            onChange={event => setNewBlogUrl(event.target.value)}
          />
        </div>
        <button type='submit'>create</button>
      </form>
    </>
  )
}
//añadimos el requerimiento de que sea una función la que se pase através de los props.
BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired
}