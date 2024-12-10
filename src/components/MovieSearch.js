import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import './MovieSearch.css';

const MovieSearch = () => {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const handleSearch = async (page = 1) => {
    if (!query.trim()) {
      setError("Please enter a movie title.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await axios.get("http://localhost:5000/search", {
        params: { title: query.trim(), page },
      });

      if (response.data.searchResults?.Response === "False") {
        setMovies([]);
        setError(response.data.searchResults.Error || "No results found.");
      } else {
        setMovies(response.data.detailedResults || []);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error("Error fetching movies data:", error.message);
      setError("Failed to fetch movie data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const saveToFavorites = async (movie) => {
    try {
      const response = await axios.post("http://localhost:5000/favorites", {
        imdbID: movie.imdbID,
        title: movie.Title,
        year: movie.Year,
        poster: movie.Poster,
        plot: movie.Plot,
        rating: movie.imdbRating,
      });
      alert(response.data.message || "Movie added to favorites!");
    } catch (error) {
      console.error("Error saving to favorites:", error.message);
      alert("Failed to add movie to favorites.");
    }
  };

  return (
    <div className="container my-4">
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Type a movie title..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="btn btn-primary" onClick={() => handleSearch()}>
          Search
        </button>
      </div>

      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-danger text-center">{error}</p>}

      <div className="row">
        {movies.map((movie) => (
          <div className="col-md-4 mb-4" key={movie.imdbID}>
            <div className="card">
              <img
                src={movie.Poster === "N/A" ? "default-poster.jpg" : movie.Poster}
                className="card-img-top"
                alt={movie.Title}
              />
              <div className="card-body">
                <h5 className="card-title">{movie.Title}</h5>
                <p className="card-text"><strong>Year:</strong> {movie.Year}</p>
                <p className="card-text"><strong>Plot:</strong> {movie.Plot || "N/A"}</p>
                <p className="card-text"><strong>Rating:</strong> {movie.imdbRating || "N/A"}</p>
                <button
                  className="btn btn-danger"
                  onClick={() => saveToFavorites(movie)}
                >
                Add to Favorites
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {movies.length > 0 && (
        <div className="d-flex justify-content-between align-items-center mt-4">
          <button
            className="btn btn-secondary"
            disabled={currentPage === 1}
            onClick={() => handleSearch(currentPage - 1)}
          >
            Previous
          </button>
          <span>Page {currentPage}</span>
          <button
            className="btn btn-secondary"
            onClick={() => handleSearch(currentPage + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default MovieSearch;
