export function PersonForm({ addNewPerson, newName, handleAddNewName, newNumber, handleAddNewNumber }) {
  return (
    <>
      <form onSubmit={addNewPerson}>
        <label>name:</label>
        <input 
          value={newName}
          onChange={handleAddNewName}
          required
        >
        </input>
        <br />
        <label>number:</label>
        <input
          value={newNumber}
          onChange={handleAddNewNumber}
          required
        >
        </input>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </>
  )
}