const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const db = require('./db'); // Import your db module
const Movieschema = require('./models/Movie');
const app = express();
const PORT = process.env.PORT || 3000;
const customHelpers = require('./custom_helper');

app.engine('hbs', exphbs.engine({extname: '.hbs',
                                defaultLayout: "main",
                                handlebars: customHelpers
                              }));
app.set('view engine', 'hbs');

// use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); 
app.use(express.static('public'));



//MongoDB connection string
const connectionString = "mongodb+srv://rushipatel100720:admin1234@cluster0.keduksp.mongodb.net/sample_mflix/?retryWrites=true&w=majority";

// Example route for the form page
app.get('/formPage', (req, res) => {
  res.render('formPage');
});

// Example route for handling form submission
app.post('/formPage', (req, res) => {
  const page = req.body.page;
  const perPage = req.body.perPage;
  const title = req.body.title;

  console.log('Received form data:', { page, perPage, title });

  // Perform the query similar to /api/Movies route
  db.getAllMovies(page, perPage, title)
    .then((movies) => {
      // Render the results using Handlebars
      console.log('Movies:', movies);
      res.render('output', {data:movies});
    })
    .catch((error) => {
      console.error('Error fetching movies:', error);
      res.status(500).send('Error fetching movies');
    });
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
