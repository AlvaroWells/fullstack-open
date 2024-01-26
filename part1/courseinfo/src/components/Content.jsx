import { Part } from "./Part"

export const Content = ({ parts }) => {
  return (
    <main>
      {parts.map((part) => (
        <Part key={part.id} part={part} />
      ))}
    </main>
  )
}