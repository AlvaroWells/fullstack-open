
//función dummy para comprobar que todo el entorno de pruebas funciona correctamente
const dummy = () => {
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
  const likesArray = blogs.map((blog) => ({
    title: blog.title,
    author: blog.author,
    likes: blog.likes
  }))

  const favoriteBlog = likesArray.find((blog) => {
    return blog.likes === Math.max(...likesArray.map(blog => blog.likes))
  })

  return favoriteBlog
}




module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
}


