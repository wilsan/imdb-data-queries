const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const movieSchema = new Schema({
   director_name: String,
   actor_1: String,
   actor_2: String,
   actor_3: String,
   title: String,
   year: String,
   imdb_score: Number
});

module.exports = mongoose.model('Movie', movieSchema);
