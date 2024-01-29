export function PersonForm({ addNewPerson, newName, handleAddNewName, newNumber, handleAddNewNumber }) {
  return (
    <>
      <form onSubmit={addNewPerson}>
        <label>name:</label>
        <input 
          value={newName}
          onChange={handleAddNewName}
        >
        </input>
        <br />
        <label>number:</label>
        <input
          value={newNumber}
          onChange={handleAddNewNumber}
        >
        </input>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </>
  )
}