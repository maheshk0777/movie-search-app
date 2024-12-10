const db = require("../db/dbConnection");



const saveFavorite = (req, res) => {
    const {imdbID, title, year, poster, plot, rating} = req.body;

    const query = `INSERT INTO favorites (imdbID, title, year, poster, plot, rating) VALUES(?,?,?,?,?,?)`;
    db.query(query, [imdbID, title, year, poster, plot, rating], (err)=>{
        if(err){
            console.error("Error saving favorites:",err.message);
            return res.status(500).json({error: "Failed to save favorite movie."});
        }
        res.status(201).json({message: "Movie saved to favorites!"});
    });
};

const fetchFavorites = (req, res) =>{
    const query = `SELECT * FROM favorites`;
    db.query(query, (err, results)=>{
        if(err){
            console.error("Error fetching favorites:", err.message);
            return res.status(500).json({error: "failed to fetch favorite movies."});
        }
        res.json(results);
    });
};


const deleteFavoriteMovie =(req, res)=>{
    const {imdbID} = req.params;

    if (!imdbID) {
        return res.status(400).json({error: "IMDb ID is required."});

    }
    const query = "DELETE FROM favorites WHERE imdbID=?";
    db.query(query,[imdbID],(err, result)=>{
        if(err){
            console.error("Error deleting favorite movie:",err.message);
            return res.status(500).json({error: "Failed to delete the movie from favorites."});
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({error: "No movie found with the given IMDb ID."});
        }
        res.json({message: "Movie successfully removed from favorites!"});
    });
};

module.exports={
    saveFavorite,
    fetchFavorites,
    deleteFavoriteMovie,
};