//El componente Note toma como parámetro el objeto creado apartir del método .map en el componente App
export const Note = ({ note, toogleImportance }) => {
  const label = note.important
    ? 'make not important' : 'make important'

  return (
    <li className="note">
      Your awesome note: {note.content}
      <button onClick={toogleImportance}>{label}</button>
    </li>
  )
}