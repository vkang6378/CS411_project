require('dotenv').config();

const express = require('express');
const app = express();
const axios = require('axios');
const cors = require('cors');
const port = process.env.PORT || 3000;

// Setup middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static hosting for built files(change public to name of frontend file)
app.use(express.static('public'));

// This function retrieves the token for a given user
async function getOAuthTokenForUser(userId) {
  // and returning the stored token
  // For this example, we'll return a placeholder token
  return "placeholder-token";
}

app.get('/search', async (req, res) => {
  try {
    const searchTerm = req.query.term;
    const userId = req.query.userId; // You'll need to get the user's ID from somewhere, perhaps it's included in the search request

    const token = await getOAuthTokenForUser(userId);
    
    // Now, you can use the token in your API requests
    const response = await axios.get(`API_URL?keyword=${searchTerm}`, {
      headers: {
        Authorization: `Bearer ${token}` // Replace with actual authorization header required by the API
      }
    });

    res.json(response.data);
  } catch (err) {
    res.json({ error: err.message });
  }
});

// Start the server
app.listen(port, () => console.log(`App listening at http://localhost:${port}`));
