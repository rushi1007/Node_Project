const mongoose = require('mongoose');
const Movie = require('./models/Movie');
const customHelpers = require('./custom_helper');

Movie.collection.createIndex({ title: 1 });

const getUserData = async (userId) => {
  
  const usersData = [
    { userId: 'rushi', data: '1234' },
    { userId: 'rushi1', data: '1234' },
    // ... (more user data)
  ];

  const userData = usersData.find(user => user.userId === userId);
  return userData ? userData.data : null;
};

module.exports = {
  
  getUserData: getUserData, // Add this line
};

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
      .lean()
      .then((movies) => {
        resolve(movies);
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

  getAllData: (limit = 200) => {
    return new Promise((resolve, reject) => {
      Movie.find({})
        .limit(limit)
        .lean()
        .then((limitedData) => {
          console.log(`Limited Data (up to ${limit} records):`, limitedData);
          resolve(limitedData);
        })
        .catch((err) => {
          console.error(err);
          reject(err);
        });
    });
  },

  searchMovies: (country, type, language, limit = 200) => {
    return new Promise((resolve, reject) => {
      // Build the query based on the provided search parameters
      const query = {
        'countries.0': country,
        type,
        'languages.0': language,
      };
  
      // Use Mongoose to find movies that match the query
      Movie.find(query)
        .limit(limit)
        .lean()
        .then((searchResults) => {
          console.log(`Search Results (up to ${limit} records):`, searchResults);
          resolve(searchResults);
        })
        .catch((err) => {
          console.error(err);
          reject(err);
        });
    });
  },

  isConnected: () => isConnected,
  
};
