import { Header } from "./Header";
import { Content } from "./Content";
import { Total } from "./Total";


export const Course = ({ course }) => {
  const totalExercises = course.parts.reduce((accumulator, part) => 
    accumulator + part.exercises
    , 0)

  return (
    <>
      <Header course={course} />
      <Content parts={course.parts} />
      <Total totalExercises={totalExercises} />
    </>
  )
}