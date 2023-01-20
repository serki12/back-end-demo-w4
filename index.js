// invoke config to get the environment variables
require('dotenv').config('.env');
const cors = require('cors');
const express = require('express');
const { auth } = require('express-openid-connect');
const morgan = require('morgan');

// create express app
const app = express();
// pull PORT from environment variables
const { PORT = 3000 } = process.env;

// middleware
// enable CORS
app.use(cors());
// log requests to console
app.use(morgan('dev'));
// parse request body
app.use(express.json());
app.use(express.urlencoded({extended:true}));

/* ************ START OIDC CODE ************ */

// env vars from process.env


// define the config object  

  
// auth router attaches /login, /logout, and /callback routes to the baseURL


// create a GET / route handler that sends back Logged in or Logged out
// req.isAuthenticated is provided from the auth router


/* ************ END OIDC CODE ************ */

// error handling middleware
app.use((error, req, res, next) => {
  console.error('SERVER ERROR: ', error);
  if(res.statusCode < 400) res.status(500);
  res.send({error: error.message, name: error.name, message: error.message});
});

app.listen(PORT, () => {
  console.log(`Server is up at http://localhost:${PORT}`);
});

