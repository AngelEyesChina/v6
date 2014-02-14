'use strict';

var api = require('./controllers/api'),
  index = require('./controllers');
var user = require('./src/routes/user');
var exercise = require('./src/routes/exercise');

function ensureAuthenticated(req, res, next) {
  //TODO Hanan: remove override
  return next();
  //from http://stackoverflow.com/a/9479932/532517
  //setup all requests to be authenticated, except for those under /auth/ (put login and logout as /auth/login etc')
  if (/^\/auth/g.test(req.url)) {
    return next();
  } else if (req.isAuthenticated()) {
    return next();
  } else {
    return next(new Error(401));
  }
  //TODO Hanan: consider using something like the following, or delete it.
  /*
   if (req.isAuthenticated())
   return next();
   else {
   redirect: res.redirect('/login');
   }*/
}

/**
 * Application routes
 */
module.exports = function (app) {
  app.all('*', ensureAuthenticated);

  // Server API Routes
  //TODO Hanan remove the "awesomeThings" example
  app.get('/api/awesomeThings', api.awesomeThings);

  app.get('/exercises/date/:displayedDate',  user.get);
  app.post('/exercises', exercise.add);
  app.get('/exercises/:exerciseID/date/:displayedDate', exercise.get);

  // All other routes to use Angular routing in app/scripts/app.js
  app.get('/partials/*', index.partials);
  app.get('/*', index.index);
};

