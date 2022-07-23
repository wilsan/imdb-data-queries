const mongoose = require('mongoose');
const Movie = require('../models/movie');
const movies = require('./movie_data');

mongoose.connect('mongodb+srv://user-wilson:RWGFsIlgTg9BEQhW@cluster0.vuj2jlw.mongodb.net/?retryWrites=true&w=majority')
   .then(() => {
      console.log('Database connected');
   })
   .catch(err => {
      console.log('Connection error:');
      console.log(err);
   });

const seedDB = async () => {
   await Movie.deleteMany({});
   for (let movie of movies) {
      const movieRecord = new Movie(movie);
      await movieRecord.save();
   }
};

seedDB().then(() => {
   mongoose.connection.close();
});
