const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  name: String,
  passowordHash: String,
  notes: [
    {
      //Los identificadores de las notas se almacenan dentro del documento del usuario como una matriz de IDs de Mongo. La definición es la siguiente:
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Note'
    }
  ],
})

userSchema.plugin(uniqueValidator)

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passowordHash
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User