export const NoteForm = ({ onSubmit, newNote, setNewNote }) => (
  <form onSubmit={onSubmit}>
      <input 
        value={newNote}
        onChange={setNewNote}
      >
      </input>
      <button type='submit'>save</button>
    </form>
)