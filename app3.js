// app3.js
require('dotenv').config();
const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const db = require('./db');
const app = express();
const PORT = process.env.PORT || 3000;
const bcrypt = require('bcrypt');
const jwtSecret = process.env.JWT_SECRET;
const jwt = require('jsonwebtoken');

// Use the bodyParser.json() middleware for parsing JSON requests
app.use(bodyParser.json());
// Use the bodyParser.urlencoded() middleware for parsing URL-encoded requests
app.use(bodyParser.urlencoded({ extended: true }));
// Serve static files from the 'public' directory
app.use(express.static('public'));

const connectionString = process.env.MONGODB_URI;

// Set up Handlebars engine
app.engine('hbs', exphbs.engine({
  extname: '.hbs',
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  }
}));
app.set('view engine', 'hbs');

// Display the form page
app.get('/formPage', (req, res) => {
  res.render('search');
});

// Handle form submission
app.post('/formPage', async (req, res) => {
  try {
    console.log('Before database query');
    const page = parseInt(req.body.page);
    const perPage = parseInt(req.body.perPage);
    const title = req.body.title;

    console.log('Received form data:', { page, perPage, title });

    // Query the database
    const movies = await db.getAllMovies(page, perPage, title);
    console.log('Movies from database:', movies);

    // Render the output page with the retrieved data
    res.render('output', { data: movies });

  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).send(`Error fetching movies: ${error.message}`);
  }
});

// In-memory user storage (replace with database in a real-world scenario)
const users = [];

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  try {
    // const token = req.headers.authorization.split(' ')[1];
    const token = req.headers.authorization;
    const decodedToken = jwt.verify(token, jwtSecret);
    req.userData = { userId: decodedToken.userId };
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed' });
  }
};
const session = require('express-session');

// Use express-session middleware
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
}));

// Display the search form
app.get('/search', (req, res) => {
  res.render('searchForm');
});

// Handle search form submission
app.post('/search', async (req, res) => {
  try {
    const country = req.body.country;
    const type = req.body.type;
    const language = req.body.language;

    // Query the database based on search parameters
    const movies = await db.searchMovies(country, type, language);

    // Render the search results page with the retrieved data
    res.render('searchResults', { data: movies });

  } catch (error) {
    console.error('Error searching movies:', error);
    res.status(500).send(`Error searching movies: ${error.message}`);
  }
});

// Register route
app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  // Check if the username is already taken
  if (users.some(user => user.username === username)) {
    return res.status(400).json({ message: 'Username is already taken' });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Store the user data (replace with database storage)
  const newUser = { username, password: hashedPassword };
  users.push(newUser);

  res.redirect('/login');
});

// Login route
app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the user by username
    const user = users.find(user => user.username === username);

    // Check if the user exists and verify the password
    if (user && await bcrypt.compare(password, user.password)) {
      // Store user ID in session
      req.session.userId = user.username;

      // Issue a JWT token upon successful login
      const token = jwt.sign({ userId: user.username }, jwtSecret, { expiresIn: '1h' });

      // Fetch limited data using db.getAllData
      try {
        const limit = 200;
        const limitedData = await db.getAllData(limit);

        // Render the protectedRoute template with the fetched data and username
        res.render('protectedRoute', { data: limitedData, username });

      } catch (error) {
        console.error('Error fetching limited data:', error);
        res.status(500).send(`Error fetching limited data: ${error.message}`);
      }

    } else {
      res.status(401).json({ message: 'Authentication failed' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send(`Error during login: ${error.message}`);
  }
});

// Logout route
app.get('/logout', (req, res) => {
  // Destroy the session and redirect to login
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
    }
    res.redirect('/login');
  });
});




// Initialize database connection and start the server
db.initialize(connectionString, (err) => {
  if (err) {
    console.error('Failed to connect to MongoDB. Check your connection string.');
  } else {
    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  }
});
