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

  //useeffect para extraer los datos de la api blogs
  useEffect(() => {
    blogService
      .getAll()
      .then(initialBlogs => {
        const mappedBlogs = initialBlogs.map(function (el, i) { //->establecemos el valor al index correspondiente de la propiedad likes de los blogs
          return { index: i, value: el.likes }
        })
        mappedBlogs.sort(function (a, b) { //-> los ordenamos de más a menos likes
          if (a.value < b.value) {
            return 1
          }
          if (a.value > b.value) {
            return -1
          }
          return 0
        })
        const sortedBlogs = mappedBlogs.map(function(el) {
          return initialBlogs[el.index]
        })
        setBlogs(sortedBlogs)//-> añadimos al estado la información ordenada
      })
  }, [])

  //funcion para manejar el tiempo del token
  const loggoutUser = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  //efecto para manejar el localstorage del loginservice para el token de usuario
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)

      const timeOutTokenId = setTimeout(() => {
        loggoutUser()
      }, 3000)//-> 1 minuto de token

      return () => clearTimeout(timeOutTokenId)
    }
  }, [])

  //* FUNCIONES QUE GUARDAN EL VALOR DEL INPUT DE LOGIN
  const handleUsername = (event) => {
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
    }, 300000)
  }

  //funcion para agregar un nuevo blog haciendo una llamada a la api
  const createBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility()

      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      setAddMessage(
        `A new blog ${blogObject.title} by ${blogObject.author} added`
      )

      setTimeout(() => {
        setAddMessage(null)
      }, 3000)
    } catch (error) {
      console.error(error)
    }
  }

  //funcion para updatear los likes de las publicaciones de un blog independiente
  const updateBlogLikes = async (id) => {
    try {
      const blogToUpdate = blogs.find(b => b.id === id)//->encontramos el blog
      const updatedBlog = { ...blogToUpdate, likes: blogToUpdate.likes + 1 }//->le sumamos +1

      const returnedBlog = await blogService.updateLikes(id, updatedBlog)
      setBlogs(blogs.map(blog => blog.id !== id ? blog : returnedBlog))

    } catch (error){
      console.error('Error updating blog', error.message)
    }
  }

  //funcion para borrar el blog seleccionado
  const deleteBlog = async (id) => {
    try {
      const blogToDelete = blogs.find(blog => blog.id === id) //->encontramos el blog por la id
      const confirmDelete = window.confirm(`
        Remove blog ${blogToDelete.title} by ${blogToDelete.author}
      `)//-> preguntamos al usuario si quiere borrar el blog
      //si devuelve true
      if (confirmDelete) {
        await blogService.deleteBlog(id) //-> llamamos a la funcion que hace una llamada al enrutador para borrar el blog con el parámetro id
        const updatedBlogs = blogs.filter(blog => blog.id !== id)
        setBlogs(updatedBlogs)
        setAddMessage(
          `${user.username} blog ${blogToDelete.title} by ${blogToDelete.author} deleted successfully`
        )
        setTimeout(() => {
          setAddMessage(null)
        }, 5000)
      }
    } catch (error) {
      console.error(error.response.data.error)
      setErrorMessage(error.message)

      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  //función que engloba el formulario de inicio de sesión
  const loginForm = () => {
    const hideWhenVisible = { display: loginVisible ? 'none' : '' }//-> estilo con renderizado condicional que modifica el estado
    const showWhenVisible = { display: loginVisible ? '' : 'none' }//-> estilo con renderizado condicional que modifica el estado

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setLoginVisible(true)}>log in</button>
        </div>
        <div style={showWhenVisible}>
          <LoginForm
            handleLogin={handleLogin}
            handleUsername={handleUsername}
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
        <Togglable buttonLabel="add blog" buttonCancelLabel="cancel" ref={blogFormRef}>
          <BlogForm
            createBlog={createBlog}
          />
        </Togglable>
      </div>
      }
      <Notification
        addMessage={addMessage}
      />
      <Blogs
        blogs={blogs}
        updateBlogLikes={(id) => updateBlogLikes(id)}
        deleteBlog={(id) => deleteBlog(id)}
        user={user}
      />
    </>
  )
}

export default App
