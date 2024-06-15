const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const bcrypt = require('bcrypt');

const URI = 'mongodb://localhost:27017/xoxo';
const targetUserTotal = 40;

const introSchema = new mongoose.Schema({
  shortIntro: {
    type: String,
    maxlength: 60
  },
  study: {
    type: String,
    maxlength: 20
  },
  location: {
    type: String,
    maxlength: 20
  },
  job: {
    type: String,
    maxlength: 60
  }
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024
  },
  profileImage: {
    type: String
  },
  coverImage: {
    type: String
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  intro: {
    type: introSchema
  },
  about: {
    type: String,
    maxlength: 260
  }
});
const User = mongoose.model('User', userSchema);

mongoose
  .connect(URI)
  .then(async () => {
    await seedUsers();
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

const createUser = async () => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const username = firstName + ' ' + lastName;

  const user = new User({
    username: username,
    email: faker.internet.email({
      provider: 'gmail.com',
      firstName,
      lastName
    }),
    password: firstName + '123',
    profileImage: faker.image.urlLoremFlickr({ category: 'person' }),
    coverImage: faker.image.urlLoremFlickr({ category: 'scenary' }),
    intro: {
      shortIntro: faker.lorem.sentence(2),
      study: faker.location.city(),
      location: faker.location.city(),
      job: faker.person.jobTitle()
    },
    about: faker.lorem.sentence(6)
  });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();
  return user;
};

const seedUsers = async () => {
  try {
    for (let i = 0; i < targetUserTotal; i++) {
      const user = await createUser();
      console.log('user created', user._id);
    }
    console.log(`${targetUserTotal} users have been successfully seeded!`);
  } catch (error) {
    console.error('Error seeding users:', error);
  } finally {
    mongoose.connection.close();
  }
};
