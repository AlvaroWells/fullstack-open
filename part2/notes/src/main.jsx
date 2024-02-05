import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'
import axios from 'axios'
import './index.css'


axios
  .get('http://localhost:3001/notes')
  .then(res => {
    const notes = res.data
    console.log(notes);
    ReactDOM.createRoot(document.getElementById('root')).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    )
})
