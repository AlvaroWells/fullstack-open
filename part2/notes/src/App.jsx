import { useState, useEffect, useRef } from 'react'
import { Note } from './components/Note'
import { Notification } from './components/Notification'
import { Footer } from './components/Footer'
import { LoginForm } from './components/LoginForm'
import { NoteForm  } from './components/NoteForm'
import noteService from './services/notes'
import loginService from './services/login'
import Togglable from './components/Togglable'


export const App = () => {
  const [notes, setNotes] = useState([])
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [loginVisible, setLoginVisible] = useState(false)

  //efecto que devuelve el conjunto de notas
  useEffect(() => {
    noteService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)
      })
  }, [])

  //función para manejar el deslogeo de la aplicación del localstorage
  const userLoggedSetTimeOut = (timeout) => {
    setTimeout(() => {
      window.localStorage.removeItem('loggedNoteappUser')
      setUser(null)
    }, timeout)
  }
  //efecto para extraer el token del localstorage
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')//-> recuperamos el token
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON) //-> transformamos la string JSON a un objeto
      setUser(user)//-> guardamos en el estado el usuario
      noteService.setToken(user.token)//->utilizamos la función obtenida de los servicios y le pasamos como parámetro la información obtenida de parsear el usuario , obteniendo el token de sesión
    }
    //iniciamos el temporizador de usuario en localstorage
    const timeoutId = userLoggedSetTimeOut(60000)
    //limpiamos el temporizador
    return () => clearTimeout(timeoutId)
  }, [])

  //funcion para agregar una nota
  const addNote = (noteObject) => {
    noteFormRef.current.toggleVisibility()
    noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
      })
  }

  //ternario para filtrar si queremos todas las notas, o sólo las importantes
  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important === true) //-> Si se activa filtrará la información y devolvera las notas importantes


  //función para cambiar la propiedad de la nota
  const toogleImportanceOf = (id) => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }

    noteService
      .update(id, changedNote)
      .then(returnedNote => {
        setNotes(notes.map(note => note.id !== id ? note : returnedNote))
      })
      .catch(e => {
        setErrorMessage(
          e, `Note '${note.content}' was alredy removed from server`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setNotes(notes.filter(n => n.id !== id))
      })
  }
  //funcion para manejar el login de usuario basado en token
  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })
      //guardamos la información del usuario en localstorage y la convertimos a formato json
      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      )

      noteService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
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
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
          <button onClick={() => setLoginVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }

  const noteFormRef = useRef()


  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage}/>

      {!user && loginForm()}
      {user && <div>
        <p style={{ color: 'white' }}>{user.name} logged in</p>
        <Togglable buttonLabel="new note" ref={noteFormRef}>
          <NoteForm
            createNote={addNote}
          />
        </Togglable>
      </div>
      }

      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>
        {notesToShow.map((note, i) => (
          <Note
            key={i}
            note={note}
            toogleImportance={() => toogleImportanceOf(note.id)}
          />
        ))}
      </ul>

      <Footer />
    </div>
  )
}