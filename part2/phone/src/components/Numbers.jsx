export function Numbers({ personsToShow }) {
  return (
    <>
      {personsToShow.map(person => (
      <p key={person.name}>{person.name} {person.number}</p>
    ))}
    </>
  )
}