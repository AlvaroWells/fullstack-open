import { useState } from 'react'

const App = () => {
  // guarda los clics de cada botón en su propio estado
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  //1.6
  const handleClickGood = () => {
    setGood(good + 1)
  }
  
  const handleClickNeutral = () => {
    setNeutral(neutral + 1)
  }
  
  const handleClickBad = () => {
    setBad(bad + 1)
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
      <p>good {good}</p>
      <p>neutral {neutral}</p>
      <p>bad {bad}</p>
    </div>
  )
}

export default App