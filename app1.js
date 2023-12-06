const express = require('express');
const cors = require('cors');

const db = require('./db'); 

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
// app.use(express.urlencoded({extended: false}))

//MongoDB connection string
const connectionString = "mongodb+srv://rushipatel100720:admin1234@cluster0.keduksp.mongodb.net/sample_mflix/?retryWrites=true&w=majority";


//calling promise-based functions

const data = {
        "plot": "A greedy tycoon decides, on a whim, to corner the world market in wheat. This doubles the price of bread, forcing the grain's producers into charity lines and further into poverty. The film...",
        
        "runtime": 14,
        "title":"Web Assignment",
        "directors":["Hardi", "Maitri"],
        "type": "Scary movie"
      };

// Call the addNewMovie method with the data argument
  db.addNewMovie(data)
    .then((result) => {
      console.log(result.message);
      console.log('Saved Movie:', result.savedMovie);
    })
    .catch((error) => {
      console.error('Failed to add new movie:', error);
    });

// db.getAllMovies(page, perPage, title)

    const page = 2;
    const perPage = 5;
    const titleFilter = 'The Avengers'; 

    // Call the getAllMovies method with the specified arguments
    db.getAllMovies(page, perPage, titleFilter)
      .then((result) => {
        console.log(result.message);
        console.log('Movies:', result.movies);
      })
      .catch((error) => {
        console.error('Failed to get movies:', error);
      });

// db.getMovieById(movieId)
    const movieId = '656c7c70f912508af13ecc06'; 

    // Get a movie by its ID
    db.getMovieById(movieId)
      .then((movie) => {
        console.log('Movie:', movie);
      })
      .catch((error) => {
        console.error('Failed to get movie by ID:', error);
      });

// db.updateMovieById(updatedMovieData, movieId)
    const updatedMovieData = {
        title: 'Web Framework 1 Assn',
    };
    db.updateMovieById(updatedMovieData, movieId)
      .then((result) => {
        console.log(result.message);
        console.log('Updated Movie:', result.updatedMovie);
      })
      .catch((error) => {
        console.error('Failed to update movie by ID:', error);
      });

// db.deleteMovieById(movieId)
    db.deleteMovieById(movieId)
      .then((result) => {
        console.log(result.message);
        console.log('Deleted Movie:', result.deletedMovie);
      })
      .catch((error) => {
        console.error('Failed to delete movie by ID:', error);
      });




// Use a callback to start the server after the connection is established
db.initialize(connectionString, (err) => {
    if (err) {
      console.error('Failed to connect to MongoDB. Check your connection string.');
    } else {
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    }
});