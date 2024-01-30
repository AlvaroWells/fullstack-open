import { useState, useEffect } from "react"
import axios from 'axios'
import { Filter } from "./components/Filter"
import { PersonForm } from "./components/PersonForm"
import { Numbers } from "./components/Numbers"






const App = () => {
  const [ persons, setPersons ] = useState([]) 
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ personsFilter, setPersonsFilter ] = useState('')
  
  useEffect(() => {
    console.log('Effect')
    axios
      .get('http://localhost:3001/persons')
      .then(res => {
        console.log('promise fulfilled')
        setPersons(res.data)
      })
  }, [])
  console.log('render', persons.length, 'persons')
  
  //Funcion que previene el re-renderizado por defecto del formulario
  const addNewPerson = (e) => {
    e.preventDefault()
    
    const nameExist = persons.some(person => person.name === newName)
    
    if (nameExist) {
      alert(`${newName} is alredy on the phonebook`)
    } else {
      const newPerson = {
        name: newName,
        number: newNumber,
        id: persons.length + 1
      }
      setPersons(persons.concat(newPerson))
      setNewName('')
      setNewNumber('')
    }


  }

  const handleAddNewName = (e) => {
    console.log(e.target.value)
    setNewName(e.target.value)
  }

  const handleAddNewNumber = (e) => {
    setNewNumber(e.target.value)
  }

  const handleFilteredNames = (e) => {
    setPersonsFilter(e.target.value)
  }

  
  const personsToShow = personsFilter
    ? persons.filter(person => person.name.toLocaleLowerCase().includes(personsFilter.toLocaleLowerCase()))
    : persons



  return (
    <div>
      <h2>Phonebook</h2>
      <Filter 
        personsFilter={personsFilter}
        handleFilteredNames={handleFilteredNames}
      />
      <h3>add a new</h3>
      <PersonForm 
        addNewPerson={addNewPerson}
        newName={newName}
        handleAddNewName={handleAddNewName}
        newNumber={newNumber}
        handleAddNewNumber={handleAddNewNumber}
      />
      <h3>Numbers</h3>
      <Numbers 
        personsToShow={personsToShow}
      />
    </div>
    
  )
}

export default App