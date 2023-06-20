const express = require('express');
const router = express.Router();
const axios = require('axios');

const ticketmasterAPIKey = 'null';

router.get('/taylor-swift-concerts', async (req, res) => {
  try {
    const response = await axios.get(
      `https://app.ticketmaster.com/discovery/v2/events.json?keyword=Taylor%20Swift&apikey=${ticketmasterAPIKey}`
    );
    
    const events = response.data._embedded?.events || [];
    
    const concerts = events.map(event => {
      const venue = event._embedded?.venues?.[0] || {};

      return {
        name: event.name,
        date: event.dates.start.localDate,
        time: event.dates.start.localTime,
        venue: venue.name,
        city: venue.city?.name,
        country: venue.country?.name,
      };
    });
    
    res.json({ concerts });
  } catch (error) {
    console.error('Error retrieving Taylor Swift concerts:', error);
    res.status(500).json({ error: 'Failed to retrieve Taylor Swift concerts' });
  }
});

module.exports = router;
