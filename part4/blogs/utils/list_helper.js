//función dummy para comprobar que todo el entorno de pruebas funciona correctamente
const dummy = (blogs) => {
  return 1
}

//función para calcular los likes de los blogs
const totalLikes = (blogs) => {
    //Contenedor de todos los likes de los blogs que lleguen por parámetros
  const likesArray = blogs.map(blog => blog.likes)
  //cálculo del total de likes con el método reduce  
  const total = likesArray.reduce((acc, currentValue) => acc + currentValue, 0)

  return likesArray.length === 0
    ? 0
    : total
}

const favoriteBlog = (blogs) => {
  //Contenedor de todos los likes de los blogs que lleguen por parámetros
  const likesArray = blogs.map(blog => blog.likes)
  console.log(likesArray)
  const favoriteBlog = likesArray.reduce((max, currentValue) => {
    return currentValue > max
      ? currentValue
      : max
  },likesArray[0])
}


module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
} 


