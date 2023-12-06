const express = require('express');
const cors = require('cors');

const db = require('./db'); // Import your db module

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
// app.use(express.urlencoded({extended: false}))

//MongoDB connection string
const connectionString = "mongodb+srv://rushipatel100720:admin1234@cluster0.keduksp.mongodb.net/sample_mflix/?retryWrites=true&w=majority";

//routes
app.get('/', (req, res) => { //just for checking
    res.send('Hello Rushi') 
});

// POST /api/Movies  [Step-2]
app.post('/api/Movies', async (req, res) => {
    try {
        const newMovieData = req.body; // our request body contains the movie data
        const savedMovie = await db.addNewMovie(newMovieData);

        // const newMovie = await db.addNewMovie(newMovieData);
        res.status(201).json(savedMovie);
        console.log("Movie data added successfully");

    } catch (error) {
        console.error('Error adding new movie:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
  });

// GET /api/Movies  [Step-2]
app.get('/api/Movies', async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const perPage = parseInt(req.query.perPage) || 10;
      const title = req.query.title;
  
      const movies = await db.getAllMovies(page, perPage, title);
      res.status(200).json(movies);
      console.log("Movie data loaded!!!!");

    } catch (error) {
      console.error('Error fetching movies:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

// GET route to get a specific movie by _id [Step-2]
app.get('/api/Movies/:id', async (req, res) => {
    try {
      const movieId = req.params.id;
      const movie = await db.getMovieById(movieId);
  
      if (!movie) {
        res.status(404).json({ error: 'Movie not found' });
        return;
      }
  
      res.status(200).json(movie);
      console.log("Specific Movie data loaded!!!!");

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

// PUT route to update a specific movie by _id [Step-2]
app.put('/api/Movies/:id', async (req, res) => {
    try {
      const movieId = req.params.id;
      const updatedMovieData = req.body;
      const updatedMovie = await db.updateMovieById(updatedMovieData, movieId);
  
      if (!updatedMovie) {
        res.status(404).json({ error: 'Movie not found' });
        return;
      }
  
      res.status(200).json(updatedMovie);
      console.log(" Movie data Updated!!!!");

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

// DELETE route to delete a specific movie by _id [Step-2]
app.delete('/api/Movies/:id', async (req, res) => {
    try {
      const movieId = req.params.id;
      const deletedMovie = await db.deleteMovieById(movieId);
  
      if (!deletedMovie) {
        res.status(404).json({ error: 'Movie not found' });
        return;
      }
  
      res.status(204).send();
      console.log(" Movie data Deleted!!!!");

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
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