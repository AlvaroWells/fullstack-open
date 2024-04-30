import { useState, useEffect, useRef } from 'react'
import blogService from './services/blogs'
import loginService from './services/login'
import { Notification } from './components/Notification'
import { LoginForm } from './components/LoginForm'
import { BlogForm } from './components/BlogForm'
import { Blogs } from './components/Blogs'
import { User } from './components/User'
import { Togglable } from './components/Togglable'
import './App.css'


function App() {
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [addMessage, setAddMessage] = useState(null)
  const [loginVisible, setLoginVisible] = useState(false)
  


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

    const timeoutTokenId = loggoutUser(3000000)//-> el token dura 5 min
    //limpiamos el token pasados los 10 minutos
    return () => clearTimeout(timeoutTokenId)
  }, [])

  //* FUNCIONES QUE GUARDAN EL VALOR DEL INPUT DE LOGIN
  const handleUserName = (event) => {
    setUsername(event.target.value)
  }
  const handlePassword = (event) => {
    setPassword(event.target.value)
  }
  //*

  
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
  //funcion para agregar un nuevo blog haciendo una llamada a la api
  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()
    
    await blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setNewBlogTitle('')
        setNewBlogAuthor('')
        setNewBlogUrl('')
        setAddMessage(
          `a new blog ${blogObject.title} by ${blogObject.author} added`
        )
      })
      setTimeout(() => {
        setAddMessage(null)
      }, 3000)
  }

  const loginForm = () => {
    const hideWhenVisible = { display: loginVisible ? 'none' : '' }
    const showWhenVisible = { display: loginVisible ? '' : 'none' }

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setLoginVisible(true)}>log in</button>
        </div>
        <div style={showWhenVisible}>
        <LoginForm 
          handleLogin={handleLogin}
          handleUserName={handleUserName}
          username={username}
          handlePassword={handlePassword}
          password={password}
        />
        <button onClick={() => setLoginVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }

  const blogFormRef = useRef()
 
  return (
    <>
      <h1>Blogs</h1>
      <Notification 
        errorMessage={errorMessage}
      />
      {!user && loginForm()}
      {user && <div>
        <User 
          user={user}
          loggoutUser={loggoutUser}
        />
        <Togglable buttonLabel="new blog" ref={blogFormRef}>
          <BlogForm 
            createBlog={addBlog}
          />
        </Togglable>
      </div>
      }
      <Notification 
        addMessage={addMessage}
      />
      <Blogs blogs={blogs}/> 
    </>
  );
}

export default App
