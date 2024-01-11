//1.1
//EJEMPLOS CON PROPS
//HEADER O TITULO
// function Header(props) {
//   return (
//     <header>
//       <h1>{props.course}</h1>
//     </header>
//   )
// }

// function Total(props) {
//   return (
//     <footer>
//       <p>
//         Number of excercises {props.totalExercises}
//       </p>
//     </footer>
//   )
// }

//CONTENT
// const Content = (props) => {
//   return (
//     <div>
//       <p>
//         {props.firstPart} have {props.firstPartExcercises} excercises
//       </p>
//       <p>
//         {props.secondPart} have {props.secondPartExcercises} excercises
//       </p>
//       <p>
//         {props.thirdPart} have {props.thirdPartExcercises} excercises
//       </p>
//     </div>
//   )
// }

//COMPONENTE FOOTER O TOTAL
// function Total(props) {
//   console.log(props)
//   return (
//     <footer>
//       <p>
//         Number of excercises {props.totalExercises}
//       </p>
//     </footer>
//   )
// }

//EJEMPLOS PASANDO COMO OBJETO EL PROP
//TITULO
const Header = ( {course} ) => {
  return <h1>{course}</h1>
}

//CONTENIDO
// const Content = ( {firstPart, firstPartExcercises, secondPart, secondPartExcercises, thirdPart, thirdPartExcercises} ) => {
//   return (
//     <>
//       <p>
//         {firstPart} {firstPartExcercises}
//       </p>
//       <p>
//         {secondPart} {secondPartExcercises}
//       </p>
//       <p>
//         {thirdPart} {thirdPartExcercises}
//       </p>
//     </>
//   )
// }


//TOTAL
const Total = ( {totalExercises} ) => {
  return <p>Number of exercises {totalExercises}</p>
}


//1.2
//pasamos como props dos argumentos en el componente Part que devuelve en un parrafo la informacion que se pasará por props en el componente padre
const Part = ( {part, exercises} ) => {
  return (
      <p>
        {part} {exercises}
      </p>
  )
}
//en el componente padre pasamos como props el objeto parts que contiene la informacion que vamos a mapear.
const Content = ( {parts} ) => {
  return (
    <div>
      {parts.map((part, index) => (
        <Part key={index} part={part.name} exercises={part.exercises} />
      ))}
    </div>
  )
}


const App = () => {
  const course = 'Half Stack application development'
  const part1 = 'Fundamentals of React'
  const exercises1 = 10
  const part2 = 'Using props to pass data'
  const exercises2 = 7
  const part3 = 'State of a component'
  const exercises3 = 14
  const totalExercises = exercises1 + exercises2 + exercises3

  const parts = [
    { name: part1, exercises: exercises1 },
    { name: part2, exercises: exercises2 },
    { name: part3, exercises: exercises3 },
  ]
  
  
  return (
    <div>
      <Header course={course} />
      <Content parts={parts} />
      <Total totalExercises={totalExercises} />
    </div>
  )
}

export default App