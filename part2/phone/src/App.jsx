import { useState, useEffect } from "react";
import { Filter } from "./components/Filter";
import { PersonForm } from "./components/PersonForm";
import { Number } from "./components/Number";
import { Notification } from "./components/Notification";
import personService from './services/persons';
import'./index.css'

const App = () => {
  const [persons, setPersons] = useState([]); 
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [personsFilter, setPersonsFilter] = useState('');
  const [message, setMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  
  


  // useEffect se utiliza para realizar efectos secundarios en componentes funcionales
  useEffect(() => {
    // Cuando el componente se monta, obtenemos los datos iniciales de persons
    personService
      .getAll()
      .then(initialPersons => {
      setPersons(initialPersons);
    });
  }, []);

  // Función para manejar el envío de un nuevo contacto o actualizar uno existente
  const addNewPerson = (e) => {
    e.preventDefault();
    
    const nameExist = persons.some(person => person.name.toLowerCase() === newName.toLowerCase());
    
    if (nameExist) {
      const numberChange = window.confirm(`${newName} is already on the phonebook, replace the old number with a new one?`);
  
      if (numberChange) {
        const existingPerson = persons.find(person => person.name.toLowerCase() === newName.toLowerCase());
        const updatedPerson = { ...existingPerson, number: newNumber };
  
        // Llamamos al servicio para actualizar el contacto en el servidor
        personService.updateObject(existingPerson.id, updatedPerson)
          .then(returnedPerson => {
            // Actualizamos el estado local con el contacto actualizado
            setPersons(persons.map(person => (person.id === existingPerson.id ? returnedPerson : person)));
            setNewName('');
            setNewNumber('');
          })
          .catch(error => {
            setErrorMessage(
              `Failed to delete contact ${existingPerson.name}`
            )
          })
          setTimeout(() => {
            setErrorMessage(null)
          }, 3000)
      } else {
        setNewName('');
        setNewNumber('');
      }
    } else {
      // Si el nombre no existe, creamos un nuevo contacto
      const newPerson = {
        name: newName,
        number: newNumber,
      };
  
      // Llamamos al servicio para crear el nuevo contacto en el servidor
      personService.createObject(newPerson)
        .then(returnedPerson => {
          // Actualizamos el estado local con el nuevo contacto
          setMessage(
            `Added ${newPerson.name}`
          )
          setTimeout(() => {
            setMessage(null)    
          }, 3000)
          setPersons(persons.concat(returnedPerson));
          setNewName('');
          setNewNumber('');
        });
    }
  };

  // Funciones para manejar cambios en el input de nombre y número
  const handleAddNewName = (e) => {
    setNewName(e.target.value);
  }

  const handleAddNewNumber = (e) => {
    setNewNumber(e.target.value);
  }

  // Función para manejar cambios en el input de filtro
  const handleFilteredNames = (e) => {
    setPersonsFilter(e.target.value);
  }

  // Filtramos los contactos según el filtro ingresado
  const personsToShow = personsFilter
    ? persons.filter(person => person.name.toLowerCase().includes(personsFilter.toLowerCase()))
    : persons;

  // Función para manejar la eliminación de un contacto
  const deleteNumber = (id, name) => {
    const confirmDelete = window.confirm(`delete ${name}?`) 

    if (confirmDelete) {
      // Llamamos al servicio para eliminar el contacto en el servidor
      personService.deleteObject(id)
        .then(() => {
          // Actualizamos el estado local excluyendo el contacto eliminado
          setPersons((prevPersons) =>
            prevPersons.filter((person) => person.id !== id)
          )
          setErrorMessage(`Contact ${name} deleted successfully`)
        })
        setTimeout(() => {
          setErrorMessage(null)
        }, 3000)
    } else {
      personsToShow;
    }
  }

  // Renderizamos el componente
  return (
    <div>
      <h2>Phonebook</h2>
      {/* Componente de filtro */}
      <Filter 
        personsFilter={personsFilter}
        handleFilteredNames={handleFilteredNames}
      />
      <Notification 
        addMessage={message} 
        errorMessage={errorMessage}/>
      <h3>add a new</h3>
      {/* Componente de formulario para agregar/editar contactos */}
      <PersonForm 
        addNewPerson={addNewPerson}
        newName={newName}
        handleAddNewName={handleAddNewName}
        newNumber={newNumber}
        handleAddNewNumber={handleAddNewNumber}
      />
      <h3>Numbers</h3>
      {/* Componentes para mostrar la lista de contactos */}
      {personsToShow.map((person) => (
        <Number
          key={person.id}
          person={person}
          deletePerson={() => deleteNumber(person.id, person.name)} />
      ))}
    </div>
  );
}

export default App;