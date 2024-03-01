export function Filter({ personsFilter, handleFilteredNames }) {
  return (
    <>
      <label>filter shown with</label>
      <input
        value={personsFilter}
        onChange={handleFilteredNames}
      ></input>
    </>
  )
}