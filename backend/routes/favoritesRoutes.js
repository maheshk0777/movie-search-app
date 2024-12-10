const express = require("express");
const router = express.Router();


const{
    saveFavorite,
    fetchFavorites,
    deleteFavoriteMovie,
}= require("../controllers/favoritesController");

router.post("/", saveFavorite);

router.get("/", fetchFavorites);

router.delete("/:imdbID", deleteFavoriteMovie);

module.exports = router;