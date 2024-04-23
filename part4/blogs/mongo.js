const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const User = require('./models/user');
const Blog = require('./models/blog');


if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://alvarogwells:${password}@cluster0.zxcwm3n.mongodb.net/testBlogApp?retryWrites=true&w=majority&appName=Cluster0`

// const url = process.env.TEST_MONGODB_URI

mongoose.set('strictQuery', false)
mongoose.connect(url)
  .then(async () => {
    console.log('Connected to MongoDB');

    // Crear usuarios
    const user1 = new User({
      username: 'testuser1',
      name: 'Test User 1',
      passwordHash: await bcrypt.hash('password1', 10)
    });
    const user2 = new User({
      username: 'testuser2',
      name: 'Test User 2',
      passwordHash: await bcrypt.hash('password2', 10)
    });

    await user1.save();
    await user2.save();

    // Crear blogs y asignarlos a los usuarios
    const blog1 = new Blog({
      title: 'Endless Story',
      author: 'Myself',
      url: 'https://endlessStory.rer',
      likes: 222,
      user: user1._id
    });
    const blog2 = new Blog({
      title: 'Mario & cia',
      author: 'Mario itself',
      url: 'https://marioSelf.es',
      likes: 15,
      user: user2._id
    });

    await blog1.save();
    await blog2.save();

    console.log('Test data created');
  })
  .catch(error => {
    console.error('Error connecting to MongoDB:', error.message);
  })
  .finally(() => {
    mongoose.connection.close();
  });