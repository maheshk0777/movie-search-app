const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const favoritesRoutes = require("./routes/favoritesRoutes");

const app = express();

// Check if OMDB_API_KEY is defined
if (!process.env.OMDB_API_KEY) {
  console.error("Error: OMDB_API_KEY is not defined in the .env file.");
  process.exit(1); // Exit the process with failure code
}

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/favorites", favoritesRoutes);

app.get("/search", async (req, res) => {
  const { title, page } = req.query;

  if (!title) {
    return res.status(400).json({ error: "Title parameter is required." });
  }

  const pageNumber = parseInt(page, 10) || 1;

  try {
    const searchResponse = await axios.get(
      `https://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&s=${title}&page=${pageNumber}`
    );

    if (searchResponse.data.Response === "False") {
      return res.status(404).json({ error: searchResponse.data.Error });
    }

    // Fetch detailed movie information
    const detailedResults = await Promise.all(
      searchResponse.data.Search.map(async (movie) => {
        try {
          const detailsResponse = await axios.get(
            `https://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&i=${movie.imdbID}`
          );
          return { ...movie, ...detailsResponse.data };
        } catch (error) {
          console.error(`Error fetching details for movie ${movie.imdbID}:`, error.message);
          return { ...movie, Plot: "N/A", imdbRating: "N/A" };
        }
      })
    );

    res.json({
      searchResults: searchResponse.data,
      detailedResults,
    });
  } catch (error) {
    console.error("Error fetching movie data:", error.message);
    res.status(500).json({ error: "Failed to fetch movie data." });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
