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

/* What is OAuth?
OAuth provides secure "delegated access" which means an application can access resources from a server on behalf of the user, 
without them having to share their credentials.

How is Auth0 related to OAuth?

Auth0 is a company that sells a version of the OAuth framework.

OpenID Connect - deals with Authentication (like .sign) - used to enable user logins on websites and mobile apps
OAuth - deals with Authorization - (like .verify) granting access without having to log in on the site itself

OIDC - implementing in web apps, it (like all 3rd party services like Auth0), can both simplify the user's life and 
our lives as developors, and also increase security of our applicaiton

User Experience and Flow
1. request /login
2. redirect us to the Auth0 application
3. we're prompted with user login, or third party apps like Auth0 or Google
4. if we click google, redirected to google's authentication server, to log in to our google account (and give permission!)
5. once authenticated, Auth0 sends the authorization code to our server

OIDC Token Usage
-- access tokens -> tells our API that the user has been authorized access
-- ID tokens -> contains information about the user so the application to customized the experience


/* ************ START OIDC CODE ************ */

// env vars from process.env IN SCREAMING_SNAKE_CASE
// BEFORE!!!
// const {
//   AUTH0_SECRET = 'N9Y4IPs8PcPzQV9gv4LSJZ2WhgiUohkYh1wY1S4RNbo',
//   AUTH0_AUDIENCE = 'http://localhost:3000',
//   AUTH0_CLIENT_ID = 'kjdGLXm2kIENlXe6EEATE9MfWKPZvUkV',
//   AUTH0_BASE_URL = 'https://dev-qdcrhjic0t4oqyqr.us.auth0.com'
// } = process.env


//AFTER!!
const {
  AUTH0_SECRET,
  AUTH0_AUDIENCE,
  AUTH0_CLIENT_ID,
  AUTH0_BASE_URL
} = process.env

// define the config object  

const config = {
  authRequired: false,  //can be set to true (or false)
  auth0Logout: true,    //enables log out
  secret: AUTH0_SECRET,
  baseURL: AUTH0_AUDIENCE,
  clientID: AUTH0_CLIENT_ID,
  issuerBaseURL: AUTH0_BASE_URL
} 
// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config))   //this is when we're initializing our connection to OpenID Connect

// create a GET / route handler that sends back Logged in or Logged out
// req.isAuthenticated is provided from the auth router
app.get('/', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? `
  <h2 style="text-align: center">My Web App, Inc.</h2>
  <h2>Welcome, ${req.oidc.user.name}</h2>
  <p><b>Username: ${req.oidc.user.nickname}</b></p>
  <p>${req.oidc.user.email}</p>
  <img src="${req.oidc.user.picture}" alt="${req.oidc.user.name}">
  ` : 'Logged out')
})




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

