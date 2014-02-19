'use strict';

var api = require('./src/routes/api'),
  index = require('./controllers');

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

  app.get('/exercises/date/:displayedDate',  api.renderTree);
  app.post('/exercises/date', api.addNewExercise);
  app.get('/exercises/:exerciseID/date/:displayedDate', api.getExerciseListing);

  app.get('/mark/user/:userID/exercise/:exerciseID/date/:date', api.markExerciseDone);
  app.get('/unmark/user/:userID/exercise/:exerciseID/date/:date', api.markExerciseUndone);

  // All other routes to use Angular routing in app/scripts/app.js
  app.get('/partials/*', index.partials);
  app.get('/*', index.index);
};

