const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');

const Movie = require('./models/movie')

// const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/imdb';

mongoose.connect('mongodb+srv://user-wilson:RWGFsIlgTg9BEQhW@cluster0.vuj2jlw.mongodb.net/?retryWrites=true&w=majority')
   .then(() => {
      console.log('Database connected');
   })
   .catch(err => {
      console.log('Connection error:');
      console.log(err);
   });

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));


app.get('/movies', async (req, res) => {
   const queries = req.query;

   // List the titles of all movies with a release date on or after 2010 in alphabetical order.
   if (Object.keys(queries).includes('year-gte')) {
      const year = queries['year-gte'];
      const fields = JSON.parse(queries['fields']);

      const movies = await Movie.find({ year: { $gte: year } }).sort({ title: 'asc' });
      res.render('queryResult', { movies, fields: Object.keys(fields) });
   }

   // List the names of film makers who have directed a movie that received a rating of at least 8.0
   else if (Object.keys(queries).includes('rating-gte')) {
      const rating = parseFloat(queries['rating-gte']);
      const fields = JSON.parse(queries['fields']);

      const movies = await Movie.aggregate([
         { $match: { imdb_score: { $gte: rating } } },
         {
            $group: {
               _id: '$director_name',
               doc: { $first: '$$ROOT' }
            }
         },
         {
            $replaceRoot: {
               newRoot: '$doc'
            }
         },
         { $sort: { director_name: 1 } }
      ]);
      res.render('queryResult', { movies, fields: Object.keys(fields) });

   }

   // List the titles of all movies in which both Brad Pitt and Angelina Jolie starred
   else if (Object.keys(queries).includes('cast-in')) {
      const actors = queries['cast-in'].split(',');
      const fields = JSON.parse(queries['fields']);

      const movies = await Movie.find({
         'actor_1': { $in: actors },
         'actor_2': { $in: actors }
      });
      res.render('queryResult', { movies, fields: Object.keys(fields) });
   }
});

app.get('/', (req, res) => {
   res.render('home');
});


app.listen(3000, () => {
   console.log('Listening on port 3000');
});
