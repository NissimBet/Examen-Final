import React from "react";
import "./App.css";
import Movie from "./Movie";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      peliculas: [],
      error: true
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    fetch("http://localhost:8080/api/moviedex")
      .then(movies => movies.json())
      .then(movies => this.setState({ peliculas: movies }))
      .catch(error => console.log(error));
  }

  async handleSubmit(event) {
    event.preventDefault();
    const { title, rating, year } = event.target;
    const titleValue = title.value;
    const ratingValue = rating.value;
    const yearValue = year.value;
    if (yearValue && titleValue && ratingValue) {
      const newMovie = await fetch("http://localhost:8080/api/moviedex", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: titleValue,
          rating: ratingValue,
          year: yearValue
        })
      });
      const newMovieData = await newMovie.json();
      this.setState({
        peliculas: [...this.state.peliculas, newMovieData],
        error: false
      });
    } else {
      this.setState({ error: true });
    }
  }

  render() {
    console.log(this.state.peliculas);
    return (
      <div>
        <h1 className="title">Movie Index</h1>
        <div className="main-container">
          <div className="movies">
            {this.state.peliculas.map(peli => (
              <Movie {...peli} key={peli.film_id + peli.film_title} />
            ))}
          </div>
          <div className="new-movie">
            <h3>New Movie</h3>
            <form
              onSubmit={event => this.handleSubmit(event)}
              className="new-movie-form"
            >
              <label htmlFor="movie-title">Title</label>
              <input
                type="text"
                name="title"
                id="movie-title"
                placeholder="Shawshank Redemption"
              />

              <label htmlFor="movie-rating">Rating</label>
              <input
                type="number"
                min="0"
                name="rating"
                id="movie-rating"
                placeholder="5"
              />

              <label htmlFor="movie-year">Release Year</label>
              <input
                type="number"
                name="year"
                id="movie-year"
                placeholder="2019"
              />
              {this.state.error && (
                <div className="full-width error">
                  <p>Por favor ingresar todos los datos</p>
                </div>
              )}
              <button className="full-width" type="submit">
                Create movie
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
