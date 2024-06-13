//El componente Note toma como parámetro el objeto creado apartir del método .map en el componente App
export const Note = ({ note, toogleImportance }) => {
  const label = note.important
    ? 'make not important' : 'make important'

  return (
    <li className="note">
      <span>{note.content}</span>
      <button onClick={toogleImportance}>{label}</button>
    </li>
  )
}