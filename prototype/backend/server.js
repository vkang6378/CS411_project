// Load environment variables
require('dotenv').config();

// Import required modules
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const authRoutes = require('./auth');
const userRoutes = require('./users');

const app = express();
const port = 3000;

// Use JSON and CORS middleware
app.use(express.json());
app.use(cors());

// Add user Session Handling
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

// Use routes from other files
app.use(authRoutes);
app.use(userRoutes);

// Add route to make the API request
app.get('/search', async (req, res) => {
  const searchTerm = req.query.term;

  const url = `API_URL?keyword=${searchTerm}&apikey=${process.env.API_KEY}`;
  
  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error(`Error: ${error}`);
    res.status(500).json({ error: 'An error occurred while fetching events' });
  }
});

app.post('/search', express.json(), async (req, res) => {
    try {
      const searchTerm = req.body.search;
      const response = await axios.get(`API_URL?keyword=${searchTerm}&apikey=${process.env.API_KEY}`);
      res.json(response.data);
    } catch (err) {
      res.json({ error: err.message });
    }
});

// Start the server
app.listen(port, () => console.log(`App listening at http://localhost:${port}`));
