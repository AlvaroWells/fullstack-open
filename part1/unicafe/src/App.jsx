import { useState } from 'react'


const Statistics = (props) => {
  return (
    <p>{props.name}: {props.notes}</p>
  )
}


const App = () => {
  // guarda los clics de cada botón en su propio estado
  const [notes, setNotes] = useState({
    good: 0,
    neutral: 0,
    bad: 0,
    total: 0,
  })
  const handleClickGood = () => {
    setNotes({
      ...notes,
      good: notes.good + 1,
      total: notes.total + 1,
    })
  }
  
  const handleClickNeutral = () => {
    setNotes({
      ...notes,
      neutral: notes.neutral + 1,
      total: notes.total + 1,
    })
  }
  
  const handleClickBad = () => {
    setNotes({
      ...notes,
      bad: notes.bad + 1,
      total: notes.total + 1,
    })
  }
  
  const average = (notes.good - notes.bad) / notes.total
  const positive = notes.good / notes.total 
  
  
  
  return (
    <div>
      <h1>give feedback</h1>
      <span>
        <button onClick={handleClickGood}>good</button>
        <button onClick={handleClickNeutral}>neutral</button>
        <button onClick={handleClickBad}>bad</button>
      </span>
      <h2>statistics</h2>
      <Statistics name="good" notes={notes.good} />
      <Statistics name="neutral" notes={notes.neutral} />
      <Statistics name="bad" notes={notes.bad} />
      <Statistics name="total" notes={notes.total} />
      <Statistics name="average" notes={average} />
      <Statistics name="positive" notes={positive} />
    </div>
  )
}

export default App

