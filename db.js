const mongoose = require('mongoose');
const Movie = require('./models/Movie');

Movie.collection.createIndex({ title: 1 });

let isConnected;

module.exports = {
  initialize: (uri, callback) => {
    mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'sample_mflix',
    });

    const db = mongoose.connection;

    db.on('error', (err) => {
      console.error('Connection error:', err);
      isConnected = false;
      callback(err);
    });

    db.once('open', () => {
      console.log('Connected to MongoDB Atlas');
      isConnected = true;
      callback();
    });
  },

  addNewMovie: (data) => {
    return new Promise((resolve, reject) => {
      const newMovie = new Movie(data);

      newMovie.save()
      .then(savedMovie => {
        resolve({ message: 'Movie Added successfully', savedMovie });

      })
      .catch(error => {
        reject(error);
      });
  });
},

  getAllMovies: (page, perPage, title) => {
    return new Promise((resolve, reject) => {
      const query = title ? { title } : {};
  
      Movie.find(query)
        .sort({ Movie_id: 1 })
        .skip((page - 1) * perPage)
        .limit(perPage)
        .lean() // Add this line to return plain JavaScript objects instead of Mongoose documents
        .then((movies) => {

        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  getMovieById: (id) => {
    return new Promise((resolve, reject) => {
      Movie.findById(id)
        .exec()
        .then((movie) => resolve(movie))
        .catch((error) => {
          console.error(error);
          reject(error);
        });
    });
  },

  updateMovieById: (data, id) => {
    return new Promise((resolve, reject) => {
      Movie.findByIdAndUpdate(id, data, { new: true })
        .exec()
        .then((updatedMovie) => resolve({ message: 'Movie Updated successfully', updatedMovie }))
        .catch((error) => {
          console.error(error);
          reject(error);
        });
    });
  },

  deleteMovieById: (id) => {
    return new Promise((resolve, reject) => {
      Movie.findOneAndDelete({ _id: id })
        .exec()
        .then((deletedMovie) => {
          if (deletedMovie) {
            resolve({ message: 'Movie deleted successfully', deletedMovie });
          } else {
            reject({ message: 'Movie not found' });
          }
        })
        .catch((error) => {
          console.error(error);
          reject(error);
        });
    });
  },


  isConnected: () => isConnected,
  
};
