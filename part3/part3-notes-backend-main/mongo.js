const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

// mongodb+srv://alvarogwells:<password>@cluster0.zxcwm3n.mongodb.net/

const password = process.argv[2]

const url = 
  `mongodb+srv://alvarogwells:${password}@cluster0.zxcwm3n.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url)

//definimos el esquema de una nota que se almacena en la variable noteSchema. El esquema le dice a Mongoose cómo se almacenarán los objetos de nota en la base de datos.
const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

//En la definición del modelo Note, el primer parámetro de "Note" es el nombre singular del modelo. El nombre de la colección será el plural notes en minúsculas, porque la convención de Mongoose es nombrar automáticamente las colecciones como el plural (por ejemplo, notes) cuando el esquema se refiere a ellas en singular (por ejemplo, Note).
const Note = mongoose.model('Note', noteSchema)

//A continuación la aplicación crea un nuevo objeto de nota con la ayuda del modelo Note:
const note = new Note({
  content: 'Hoy gano al padel 100%',
  important: false,
})


//Guardar el objeto en la base de datos ocurre con el método save, que se puede proporcionar con un controlador de eventos con el método then:
// note.save().then(result => {
  //   console.log(result)
  //   console.log('note saved!')
  //   mongoose.connection.close()
  // })
  
  
  
Note.find({ important: true }).then(result => {
  result.forEach(note => {
    console.log(note)
  })
  mongoose.connection.close()
})