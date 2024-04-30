import { useState, useEffect } from 'react'
import blogService from './services/blogs'
import loginService from './services/login'
import { Notification } from './components/Notification'
import { LoginForm } from './components/LoginForm'
import { BlogForm } from './components/BlogForm'
import { Blogs } from './components/Blogs'
import { User } from './components/User'
import './App.css'


function App() {
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
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

  //* FUNCIONES QUE GUARDAN EL VALOR DEL INPUT DE LOS BLOGS.
  const handleNewBlogTitle = (event) => {
    setNewBlogTitle(event.target.value)
  }
  const handleNewBlogAuthor = (event) => {
    setNewBlogAuthor(event.target.value)
  }
  const handleNewBlogUrl = (event) => {
    setNewBlogUrl(event.target.value)
  }
  const handleNewBlogLikes = (event) => {
    setNewBlogLikes(event.target.value)
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
        <LoginForm 
          handleLogin={handleLogin}
          handleUserName={handleUserName}
          username={username}
          handlePassword={handlePassword}
          password={password}
        />
      ) : (
        <>
          <Notification 
            addMessage={addMessage}
          />
          <User 
            user={user}
            loggoutUser={loggoutUser}
          />
          <BlogForm 
            addBlog={addBlog}
            newBlogTitle={newBlogTitle}
            handleNewBlogTitle={handleNewBlogTitle}
            newBlogAuthor={newBlogAuthor}
            handleNewBlogAuthor={handleNewBlogAuthor}
            newBlogUrl={newBlogUrl}
            handleNewBlogUrl={handleNewBlogUrl}
            newBlogLikes={newBlogLikes}
            handleNewBlogLikes={handleNewBlogLikes}
          />
          <Blogs blogs={blogs}/> 
        </>
      )}
    </>
  );
}

export default App
