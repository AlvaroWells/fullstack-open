export const CountryInfo = ({ countryInfo, handleClickShowSelectedCountry }) => {
  
  const problematicCountry = countryInfo.find(country => {
    return !country.languages || Object.keys(country.languages).length === 0
  })

  if (problematicCountry) {
    // Aquí puedes manejar el objeto problemático como desees
    console.log('El país problemático es:', problematicCountry);
    // Puedes realizar acciones como eliminarlo, corregirlo o simplemente registrar el problema
  } else {
    console.log('No se encontraron países problemáticos.');
  }

  

  //Informacion de un sólo país de forma detallada
  const singleCountryInfo = countryInfo.map((country, id) => {
    return (
      <main key={id}>
        <h1>{country.name.common}</h1>
        <span>
          <p>{country.capital}</p>
          <p>{country.area}</p>
        </span>

        <ul>
          {country.languages && Object.values(country.languages).map((language, index) => (
            <li key={index}>
              {language}
            </li>
          ))}
        </ul>
        <img src={country.flags.png} />
      </main>
    )
  })

  //información de varios países sin detalle
  const countriesInformation = countryInfo.map((country, id) => {
    return (
      <main key={id}>
        <span>{country.name.common}</span>
        <button onClick={() => handleClickShowSelectedCountry(country)}>show</button>
      </main>
    )
  })

  if (countryInfo.length > 10) {
    return (
      <main>
        <p>Too many matches, specify another filter</p>
      </main>
    )
  }

  if (countryInfo.length === 1) {
    return (
      singleCountryInfo
    )
  }

  if (countryInfo.length < 10 && countryInfo.length !== 1) {
    return (
      countriesInformation
    )
  }
}

