import { useState, useEffect } from 'react'
import { Note } from './components/Note'
import { Notification } from './components/Notification'
import { Footer } from './components/Footer'
import { LoginForm } from './components/LoginForm'
import { NoteForm  } from './components/NoteForm'
import noteService from './services/notes'
import loginService from './services/login'


export const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

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

  
  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5,
    }
    
    noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
        setNewNote('')
      })
  }
  newNote.concat
  const handleNoteChange = (e) => {
    console.log(e.target.value)
    setNewNote(e.target.value)
  }

  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important === true) //-> Si se activa filtrará la información y devolvera las notas importantes

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

  

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage}/> 
      <h2>Login</h2>

      {user === null ?
        <LoginForm
          onSubmit={handleLogin}
          username={username}
          password={password}
          setUsername={setUsername}
          setPassword={setPassword}
        /> :
        <div>
          <p style={{ color: '#f5f5dc' }}>{user.name} logged-in</p>
          <NoteForm 
            onSubmit={addNote}
            newNote={newNote}
            setNewNote={handleNoteChange}
          />
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
            toogleImportance={() => toogleImportanceOf(note.id)} />
        ))}
      </ul>
      
      <Footer />
    </div>
  )
}