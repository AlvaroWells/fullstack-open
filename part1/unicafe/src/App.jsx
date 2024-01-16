import { useState } from 'react'

const App = () => {
  // guarda los clics de cada botón en su propio estado
  const [notes, setNotes] = useState({
    good: 0,
    neutral: 0,
    bad: 0,
    total: 0,
    average: 0,
    positive: 0
  })
  
  
  

  //1.6
  const handleClickGood = () => {
    setNotes({
      ...notes,
      good: notes.good + 1,
      total: notes.total + 1,
      average: (notes.good - notes.bad) / notes.total,
      positive: notes.good / notes.total
    })
  }
  
  const handleClickNeutral = () => {
    setNotes({
      ...notes,
      neutral: notes.neutral + 1,
      total: notes.total + 1,
      average: (notes.good - notes.bad) / notes.total,
      positive: notes.good / notes.total
    })
  }
  
  const handleClickBad = () => {
    setNotes({
      ...notes,
      bad: notes.bad + 1,
      total: notes.total + 1,
      average: (notes.good - notes.bad) / notes.total,
      positive: notes.good / notes.total
    })
  }

  
  return (
    <div>
      <h1>give feedback</h1>
      <span>
        <button onClick={handleClickGood}>good</button>
        <button onClick={handleClickNeutral}>neutral</button>
        <button onClick={handleClickBad}>bad</button>
      </span>
      <h2>statistics</h2>
      <p>good: {notes.good}</p>
      <p>neutral: {notes.neutral}</p>
      <p>bad: {notes.bad}</p>
      <p>all: {notes.total}</p>
      <p>average: {notes.average}</p>
      <p>positive: {notes.positive}%</p>
    </div>
  )
}

export default App