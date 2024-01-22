import { useState } from "react";

//Creamos el componente que mediante props recogemos la información que queramos renderizar. en este caso las props las usamos mediante desestructuración.
const Statistics = ({ name, stats }) => {
  return (
    <tr>
      <td>{name}</td>
      <td>{stats}</td>
    </tr>
  )
}
//Creamos componente Button donde le pasamos como props desestructuradas como parámetros donde le pasaremos la información apartir del componente donde renderizamos la aplicación.
const Button = ({ label, onClick }) => {
  return (
    <button onClick={onClick}>{label}</button>
  )
}

//componente padre, el cual es el responsable de renderizar la aplicación con JSX
export default function App() {
  //creamos una matriz con la cual manejar el estado de la aplicación.
  //notes contiene la información de los objetos creados en su interior con la estructura siguiente:
  // (key: value) key es el nombre de la propiedad, y su valor correspondiente, en este caso un valor num
  const [notes, setNotes] = useState({
    good: 0,
    neutral: 0,
    bad: 0,
  });
  
  //creamos otro manejo de estados, que se inicializa con un estado booleano, en este caso , false
  const [feedback, setFeedback] = useState(false)

  //creamos una función con la cual manejar manualmente el cambio de estado de la aplicación, le pasamos un parámetro con el cual obtendremos información.
  //setNotes es una variable que se encargará de actualizar la información del estado de la aplicación, le pasamos un parámetro, que contendrá la información previa al cambio de estado, para almaneralo de manera interna y trabajar a posterior con él utilizando el spread operator "..."
  //utilizamos el parámetro type de la función, para que recoja la información previa del estado, y le decimos que le sume + 1, esta información a type le llegará cuando llamemos a la funcion con el onclick en el botón através del nombre de la propiedad.
  const handleClickNotes = (type) => {
    setNotes(prevNotes => ({
      ...prevNotes,
      [type]: prevNotes[type] + 1
    })) 
  }

  //utilizamos la desestructuración de JS para almacenar la información del estado notes y poder hacer así los cálculos dependiendo del cambio de estado.
  const { good, neutral, bad } = notes
  const total = good + neutral + bad
  const average = (good - bad) / total
  const positive = total === 0 ? 0 : Math.floor((good / total) * 100) 

  //creamos una funcion que cambie el estado booleano de false a true cuando sea llamada con la funcion en el boton onclick
  const collectFeedback = () => {
    setFeedback(true)
  }

  //aquí es donde se renderiza la aplicación mediante JSX, los botones tienen una propiedad onclick, a la cual creamos una funcion que llama a las dos funciones que cambian y actualizan el estado de la aplicación, a la primera le pasamos el nombre de la propiedad del objeto como parámetro.

  // a continuación, creamos un condicional ternario que se inicializa en false, el cual renderizará la segunda parte que devuelve true al estado inicial que es false.
  return (
    <div>
      <h1>give feedback</h1>
      <span>
        <Button onClick={() => {handleClickNotes('good'); collectFeedback()}} label={'good'} />
        <Button onClick={() => {handleClickNotes('neutral'); collectFeedback()}} label={'neutral'}/>
        <Button onClick={() => {handleClickNotes('bad'); collectFeedback()}} label={'bad'} />
      </span>
      <h2>statistics</h2>
      {feedback ? (
        <table>
          <tbody>
            <Statistics name="good" stats={good} />
            <Statistics name="neutral" stats={neutral} />
            <Statistics name="bad" stats={bad} />
            <Statistics name="total" stats={total} />
            <Statistics name="average" stats={average} />
            <Statistics name="positive" stats={`${positive}%`} />
          </tbody>
        </table>
      ) : (
        <p>No feedback given</p>
      )}
    </div>
  );
}



//CODIGO REPASO HECHO POR SEGUNDA VEZ, SÓLO CON DOCUMENTACIÓN Y IMPLEMENTANDO LO APRENDIDO.
// import { useState } from "react";

// const StatisticsLine = (props) => {
//   return (
//     <tr>
//       <td>{props.name}</td>
//       <td>{props.value}</td>
//     </tr>
//   );
// };

// const Button = ({ onClick, label }) => {
//   return <button onClick={onClick}>{label}</button>;
// };

// const App = () => {
//   // guarda los clics de cada botón en su propio estado
//   const [votes, setVotes] = useState({
//     good: 0,
//     neutral: 0,
//     bad: 0,
//   });
//   const [initialStatistics, setInitialStatistics] = useState(false);

//   const handleClickVote = (type) => {
//     setVotes((prevVotes) => ({
//       ...prevVotes,
//       [type]: prevVotes[type] + 1,
//     }));
//     setInitialStatistics(true);
//   };

//   const { good, neutral, bad } = votes;
//   const total = good + neutral + bad;
//   const average = (good - bad) / total;
//   const positive = Math.floor((good / total) * 100);

//   return (
//     <>
//       <div>
//         <h1>give feedback</h1>
//         <Button onClick={() => handleClickVote("good")} label={"good"} />
//         <Button onClick={() => handleClickVote("neutral")} label={"neutral"} />
//         <Button onClick={() => handleClickVote("bad")} label={"bad"} />
//       </div>
//       <div>
//         <h2>statistics</h2>
//         {initialStatistics ? (
//           <>
//             <table>
//               <tbody>
//                 <StatisticsLine name="good" value={good} />
//                 <StatisticsLine name="neutral" value={neutral} />
//                 <StatisticsLine name="bad" value={bad} />
//                 <StatisticsLine name="total" value={total} />
//                 <StatisticsLine name="average" value={average} />
//                 <StatisticsLine name="positive" value={`${positive}%`} />
//               </tbody>
//             </table>
//           </>
//         ) : (
//           <p>No statistics given</p>
//         )}
//       </div>
//     </>
//   );
// };

// export default App;
