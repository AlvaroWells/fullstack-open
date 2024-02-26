import { useEffect, useState } from 'react'
import axios from 'axios'
import { FilterCountries } from './components/FilterCountries'
import { CountryInfo } from './components/CountryInfo'
import './App.css'

//endpoint de la api rest de todos los paises
const API_ALL_COUNTRIES_ENDPOINT = 'https://studies.cs.helsinki.fi/restcountries/api/all'
//endpoint de la api rest de los países por su nombre
// const API_COUNTRY_NAME_ENDPOINT = `https://studies.cs.helsinki.fi/restcountries/api/name/${countryToShow}`

function App() {
  const [ countryFilter, setCountryFilter ] = useState('')
  const [ countries, setCountries ] = useState([])
  const [ selectedCountry, setSelectedCountry ] = useState(null)
  

  useEffect(() => {
    if (countries) {
      axios
        .get(API_ALL_COUNTRIES_ENDPOINT)
        .then(res => {
          setCountries(res.data)
        })
    }
  },[])

  //Utilizamos la información del input almacenada dentro de la variable de estado countryFilter y la almacenamos en la nueva variable utilizando un condicional ternario.
  //Utilizamos el método filter , que nos devuelve un nuevo array de objetos según la condición.
  const countryInfo = countryFilter
    ? countries.filter(country => country.name.common.toLowerCase().includes(countryFilter.toLowerCase()))
    : []
  
  //funcion para almacenar la información del valor del input la almacena dentro de la variable de estado countryFilter
  const handleCountryFilter = (e) => {
    setCountryFilter(e.target.value)
  }

  const countryDetails = selectedCountry 
    ? (
    <div>
        <h1>{selectedCountry.name.common}</h1>
        <p>Capital: {selectedCountry.capital}</p>
        <p>Area: {selectedCountry.area}</p>
        <p>Languages:</p>
        <ul>
            {Object.values(selectedCountry.languages).map((language, index) => (
                <li key={index}>{language}</li>
            ))}
        </ul>
        <img src={selectedCountry.flags.png} alt="Flag" />
    </div>
    ) 
    : null;

  //funcion que al ser llamada desde el botón nos devuelve la información del país seleccionado y almacena la información en el estado.
  const handleClickShowSelectedCountry = (country) => {
    setSelectedCountry(country);
  }


  return (
    <>
      <FilterCountries 
        countryFilter={countryFilter}
        handleCountryFilter={handleCountryFilter}
      />
      <CountryInfo 
        countryInfo={countryInfo}
        handleClickShowSelectedCountry={handleClickShowSelectedCountry}
        />
      {countryDetails}
    </>
  )
}

export default App




