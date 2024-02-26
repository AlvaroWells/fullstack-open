export const FilterCountries = ({ countryFilter, handleCountryFilter }) => {
  return (
    <header>
      <label>find countries:</label>
      <input value={countryFilter} onChange={handleCountryFilter}></input>
    </header>
  )
}