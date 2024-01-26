//El componente Note toma como parámetro el objeto creado apartir del método .map en el componente App
export const Note = ({ note }) => {
  return (
    <li>{note.content}</li>
  )
}