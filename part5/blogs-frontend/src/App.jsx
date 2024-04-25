import { useState, useEffect } from 'react'
import blogService from './services/blogs'
import loginService from './services/login'
import './App.css'


function App() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)

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
