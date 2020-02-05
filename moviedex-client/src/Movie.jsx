import React from "react";
import "./Movie.css";

const Movie = ({ film_title, rating, year, ...props }) => {
  return (
    <div className="movie-container" {...props}>
      <h4>{film_title}</h4>

      <p className="movie-rating">The movie's rating is {rating}</p>
      <p>
        It was released in <span className="movie-release">{year}</span>
      </p>
    </div>
  );
};

export default Movie;
