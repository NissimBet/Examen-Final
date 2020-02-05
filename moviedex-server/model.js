let mongoose = require("mongoose");
let uuid = require("uuid");

mongoose.Promise = global.Promise;

const MovieModelSchema = new mongoose.Schema({
  film_id: { type: String, default: uuid.v4() },
  film_title: String,
  year: Number,
  rating: Number
});

const Movie = mongoose.model("movies", MovieModelSchema);

module.exports = {
  createMovie: async ({ film_title, year, rating }) => {
    try {
      const createdMovie = await Movie.create({ film_title, year, rating });
      return createdMovie;
    } catch (error) {
      throw Error(error);
    }
  },
  getMovies: async () => {
    try {
      const allMovies = await Movie.find();
      return allMovies;
    } catch (error) {
      throw Error(error);
    }
  }
};
