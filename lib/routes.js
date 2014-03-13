'use strict';

var api = require('./src/routes/api'),
  index = require('./controllers');
var passport = require('passport');

function ensureAuthenticated(req, res, next) {
  //TODO Hanan: consider using something like the following, or delete it.
  // from http://stackoverflow.com/a/9479932/532517
  //setup all requests to be authenticated, except for those under /auth/ (put login and logout as /auth/login etc')
  /*  if (/^\/auth/g.test(req.url)) {
   return next();
   } else if (req.isAuthenticated()) {
   return next();
   } else {
   var e = new Error('Unauthorized', 401);
   e.status = 401;
   return next(e);
   }*/
  //TODO Hanan: consider using something like the following, or delete it.
  if (req.isAuthenticated()) {
    return next();
  } else {
    var e = new Error('Unauthorized', 401);
    e.status = 401;
    return next(e);
  }
}

/**
 * Application routes
 */
module.exports = function (app) {
  app.all('/api/*', ensureAuthenticated);

  require('./config/passport')(passport); // pass passport for configuration
  // Server API Routes


  app.get('/mark/user/:userID/exercise/:exerciseID/date/:date', api.markExerciseDone);
  app.get('/unmark/user/:userID/exercise/:exerciseID/date/:date', api.markExerciseUndone);

  /*
   /api/v/:version/exercise/:listController:exerciseID/:docController
   */
  app.get('/api/v/1/exercise/all/:displayedDate', api.renderTree);
  app.get('/api/v/1/exercise/:exerciseID/show/:displayedDate', api.getExerciseListing);
  app.post('/api/v/1/exercise/:exerciseID/markExerciseDone/:date', api.markExerciseDone);
  app.post('/api/v/1/exercise/:exerciseID/markExerciseUndone/:date', api.markExerciseUndone);
  app.post('/api/v/1/exercise/new', api.addNewExercise);


  // =====================================
  // GOOGLE ROUTES =======================
  // =====================================
  // send to google to do the authentication
  // profile gets us their basic information including their name
  // email gets their emails
  app.get('/auth/google', passport.authenticate('google', { scope: ['email'] }));

  // the callback after google has authenticated the user
  app.get('/auth/google/callback',
    passport.authenticate('google', {
      successRedirect: '/profile',
      failureRedirect: '/'
    }));


  // All other routes to use Angular routing in app/scripts/app.js

  app.get('/partials/*', index.partials);
  app.get('/*', index.index);
};

