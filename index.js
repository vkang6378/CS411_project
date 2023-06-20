const express = require('express');
const session = require('express-session');
const passport = require('passport');
const TwitterStrategy = require('passport-twitter').Strategy;
const mysql = require('mysql2');
const twitterRoutes = require('./routers/twitter');
const ticketmasterRoutes = require('./routers/ticketmaster');

// Configure your Twitter API credentials
const TWITTER_CONSUMER_KEY = 'null';
const TWITTER_CONSUMER_SECRET = 'null';

// Configure your MySQL database connection
const connection = mysql.createConnection({
  host: 'null',
  user: 'root',
  password: 'null',
  database: 'null',
});

// Configure the Passport Twitter strategy
passport.use(
  new TwitterStrategy(
    {
      consumerKey: TWITTER_CONSUMER_KEY,
      consumerSecret: TWITTER_CONSUMER_SECRET,
      callbackURL: 'http://localhost:3000/auth/twitter/callback',
    },
    (token, tokenSecret, profile, done) => {
      // Store the user's token and tokenSecret in the MySQL database
      const user = {
        access_token: token,
        access_token_secret: tokenSecret,
        screen_name: profile.username,
      };
      connection.query('INSERT INTO users SET ?', user, (err, result) => {
        if (err) {
          console.error('Error storing user credentials:', err);
          return done(err);
        }
        user.id = result.insertId;
        return done(null, user);
      });
    }
  )
);

// Serialize and deserialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  connection.query('SELECT * FROM users WHERE id = ?', id, (err, results) => {
    if (err) {
      console.error('Error retrieving user:', err);
      return done(err);
    }
    done(null, results[0]);
  });
});

// Create the Express application
const app = express();

// Configure Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  })
);

// Initialize Passport and restore authentication state, if any, from the session
app.use(passport.initialize());
app.use(passport.session());

// Define the routes
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/auth/twitter', passport.authenticate('twitter'));

app.get(
  '/auth/twitter/callback',
  passport.authenticate('twitter', {
    successRedirect: '/main',
    failureRedirect: '/',
  })
);

app.get('/main', (req, res) => {
  res.sendFile(__dirname + '/main.html');
});

// Connect the Twitter routes
app.use('/api', twitterRoutes);
app.use('/api', ticketmasterRoutes);

// Start the server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});

