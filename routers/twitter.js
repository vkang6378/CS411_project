const express = require('express');
const router = express.Router();
const axios = require('axios');
const mysql = require('mysql2');

// Configure your Twitter API credentials
const TWITTER_API_KEY = 'null';
const TWITTER_API_SECRET = 'null';
const TWITTER_BEARER_TOKEN = 'null';

// Configure your MySQL database connection
const connection = mysql.createConnection({
  host: 'null',
  user: 'null',
  password: 'null',
  database: 'null',
});

// GET /api/following route handler
router.get('/following', (req, res) => {
  // Retrieve the user's credentials and token from the MySQL database
  connection.query('SELECT * FROM users WHERE id = 1', (err, results) => {
    if (err) {
      console.error('Error retrieving user credentials:', err);
      res.status(500).json({ error: 'Failed to retrieve user credentials' });
    } else {
      const user = results[0];

      // Configure the Axios HTTP client with the Twitter API credentials
      const axiosInstance = axios.create({
        baseURL: 'https://api.twitter.com/2/',
        headers: {
          Authorization: `Bearer ${TWITTER_BEARER_TOKEN}`,
        },
      });

      // Get the user's ID using the Twitter API
      axiosInstance
        .get(`users/by/username/${user.screen_name}`)
        .then(response => {
          const userId = response.data.data.id;

          // Get the user's following using the Twitter API
          axiosInstance
            .get(`users/${userId}/following`)
            .then(response => {
              // Extract the following usernames from the API response
              const following = response.data.data.map(user => user.username);

              // Send the following list as the API response
              res.json({ following });
            })
            .catch(error => {
              console.error('Error retrieving following:', error);
              res.status(500).json({ error: 'Failed to retrieve following' });
            });
        })
        .catch(error => {
          console.error('Error retrieving user ID:', error);
          res.status(500).json({ error: 'Failed to retrieve user ID' });
        });
    }
  });
});

module.exports = router;


