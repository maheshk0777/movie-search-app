import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import './Favorites.css';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState(null);

  const fetchFavorites = async () => {
    try {
      const response = await axios.get("http://localhost:5000/favorites");
      setFavorites(response.data);
    } catch (error) {
      console.error("Error fetching favorites:", error.message);
      setError("Failed to fetch favorites. Please try later.");
    }
  };

  const removeFavorite = async (imdbID) => {
    try {
      const response = await axios.delete(`http://localhost:5000/favorites/${imdbID}`);
      alert(response.data.message || "Movie removed from favorites!");
      fetchFavorites();
    } catch (error) {
      console.error("Error removing favorites:", error.message);
      alert("Failed to remove from favorites.");
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  return (
    <div className="container my-4">
      <h2 className="text-center">Favorites</h2>
      {error && <p className="text-danger text-center">{error}</p>}
      <div className="row">
        {favorites.map((movie) => (
          <div className="col-md-4 mb-4" key={movie.imdbID}>
            <div className="card movie-card">
              {/* Movie Poster */}
              <img
                src={movie.poster === "N/A" ? "default-poster.jpg" : movie.poster}
                className="card-img-top movie-poster"
                alt={movie.title}
              />
              <div className="card-body">
                {/* Movie Title */}
                <h5 className="card-title">{movie.title}</h5>
                {/* Movie Year */}
                <p className="card-text"><strong>Year:</strong> {movie.year}</p>
                {/* Movie Plot */}
                <p className="card-text"><strong>Plot:</strong> {movie.plot || "N/A"}</p>
                {/* Movie Rating */}
                <p className="card-text"><strong>Rating:</strong> {movie.rating || "N/A"}</p>
                {/* Remove from Favorites Button */}
                <button
                  className="btn btn-danger btn-heart"
                  onClick={() => removeFavorite(movie.imdbID)}
                >
                  Remove 
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Favorites;
