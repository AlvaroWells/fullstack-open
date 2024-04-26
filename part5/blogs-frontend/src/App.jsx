import { useState, useEffect } from 'react'
import blogService from './services/blogs'
import loginService from './services/login'
import { Notification } from './components/Notification'
import './App.css'


function App() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [blogs, setBlogs] = useState([])
  const [newBlogTitle, setNewBlogTitle] = useState('')
  const [newBlogAuthor, setNewBlogAuthor] = useState('')
  const [newBlogUrl, setNewBlogUrl] = useState('')
  const [newBlogLikes, setNewBlogLikes] = useState(0)
  const [errorMessage, setErrorMessage] = useState(null)
  const [addMessage, setAddMessage] = useState(null)


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
    } else { //-->regla de tiempo para eliminar el usuario registrado con token
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
    } catch (error) {
      setErrorMessage(
        'wrong credentials', error.message
      )
    }
    setTimeout(() => {
      setErrorMessage(null)
    }, 3000)
    
  }
  
  const addBlog = async (event) => {
    event.preventDefault()
    const blogObject = {
      title: newBlogTitle,
      author: newBlogAuthor,
      url: newBlogUrl,
      likes: newBlogLikes
    }
    
    await blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setNewBlogTitle('')
        setNewBlogAuthor('')
        setNewBlogUrl('')
        setNewBlogLikes(0)
        setAddMessage(
          `a new blog ${blogObject.title} by ${blogObject.author} added`
        )
      })
      setTimeout(() => {
        setAddMessage(null)
      }, 3000)
  }

  return (
    <>
      <h1>Blogs</h1>
      <Notification 
        errorMessage={errorMessage}
      />
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
          <Notification 
            addMessage={addMessage}
          />
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
            <div>
             likes:
                <input
                  type='number'
                  url='Likes'
                  value={newBlogLikes}
                  onChange={({ target }) => setNewBlogLikes(target.value)}
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
              <p>likes: {blog.likes}</p>
            </div>
          ))}
        </>
      )}
    </>
  );
}

export default App
