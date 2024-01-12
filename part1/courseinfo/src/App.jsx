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
const Header = ({ course }) => {
  return <h1>{course.name}</h1>
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
const Total = ({ totalExercises }) => {
  return <p>Number of exercises {totalExercises}</p>
}


//1.2
//pasamos como props dos argumentos en el componente Part que devuelve en un parrafo la informacion que se pasará por props en el componente padre
const Part = ({ part, exercises }) => {
  //console.log(part)
  return (
      <p>
        {part} {exercises}
      </p>
  )
}
//en el componente padre pasamos como props el objeto parts que contiene la informacion que vamos a mapear.
const Content = ({ parts }) => {
  //console.log(parts)
  return (
    <div>
      {parts.map((part, index) => (
        <Part key={index} part={part.name} exercises={part.exercises} />
      ))}
    </div>
  )
}


const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }
  
  // 1.4
  const totalExercises = course.parts[0].exercises + course.parts[1].exercises + course.parts[2].exercises


  // 1.2 && 1.3
  // const parts = [
  //   { name: part1.name, exercises: part1.exercises },
  //   { name: part2.name, exercises: part2.exercises },
  //   { name: part3.name, exercises: part3.exercises },
  // ]


  //1.5
  const parts = course.parts
  

  
  
  return (
    <div>
      <Header course={course} />
      <Content parts={parts} />
      <Total totalExercises={totalExercises} />
    </div>
  )
}

export default App