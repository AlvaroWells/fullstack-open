import { useState, useEffect } from 'react'
import blogService from './services/blogs'
import loginService from './services/login'
import './App.css'


function App() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [blogs, setBlogs] = useState([])
  const [newBlogTitle, setNewBlogTitle] = useState('')
  const [newBlogAuthor, setNewBlogAuthor] = useState('')
  const [newBlogUrl, setNewBlogUrl] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)


  useEffect(() => {
    blogService
      .getAll()
      .then(initialBlogs => {
        setBlogs(initialBlogs)
      })
  }, [])
  
  //funcion para manejar el tiempo del token
  const loggoutUser = (timeout) => {
    const handleLoggout = window.localStorage.removeItem('loggedBlogappUser')

    if (handleLoggout) {
      setUser(null)
    } else {
      setTimeout(() => {
        window.localStorage.removeItem('loggedBlogappUser')
        setUser(null)
      }, timeout)
    }
  }
  //efecto para manejar el localstorage del loginservice para el token de usuario
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }

    const timeoutTokenId = loggoutUser(6000000)//-> el token dura 10 min
    //limpiamos el token pasados los 10 minutos
    return () => clearTimeout(timeoutTokenId)
  }, [])

  const handleUserName = (event) => {
    setUsername(event.target.value)
  }

  const handlePassword = (event) => {
    setPassword(event.target.value)
  }
  //funcion para el manejo del login con localstorage token
  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')//->limpiamos el componente cuando enviamos el form
      setPassword('')//->limpiamos el componente cuando enviamos el form
    } catch (exception) {

    }
  }
  
  const addBlog = async (event) => {
    event.preventDefault()
    const blogObject = {
      title: newBlogTitle,
      author: newBlogAuthor,
      url: newBlogUrl
    }

    await blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setNewBlogTitle('')
        setNewBlogAuthor('')
        setNewBlogUrl('')
      })
  }

  return (
    <>
      <h1>log in to application</h1>
      {user === null ? (
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              type='text'
              name='Username'
              value={username}
              onChange={handleUserName}
            />
          </div>
          <div>
            password
            <input
              type='password'
              name='Password'
              value={password}
              onChange={handlePassword}
            />
          </div>
          <button type='submit'>login</button>
        </form>
      ) : (
        <>
          <div>
            <p>{user.name} logged-in</p>
            <button onClick={loggoutUser}>logout</button>
          </div>
          <h3>Create new</h3>
          <form onSubmit={addBlog}>
            <div>
              title:
                <input
                  type='text'
                  title='Title'
                  value={newBlogTitle}
                  onChange={({ target }) => setNewBlogTitle(target.value)}
                />
            </div>
            <div>
              author:
                <input
                  type='text'
                  author='Author'
                  value={newBlogAuthor}
                  onChange={({ target }) => setNewBlogAuthor(target.value)}
                />
            </div>
            <div>
              url:
                <input
                  type='url'
                  url='Url'
                  value={newBlogUrl}
                  onChange={({ target }) => setNewBlogUrl(target.value)}
                />
            </div>
          <button type='submit'>create</button>
          </form>
          <h2>Blogs</h2>
          {blogs.map(blog => (
            <div key={blog.id}>
              <p>title: {blog.title}</p>
              <p>author: {blog.author}</p>
              <p>url: {blog.url}</p>
            </div>
          ))}
        </>
      )}
    </>
  );
}

export default App
