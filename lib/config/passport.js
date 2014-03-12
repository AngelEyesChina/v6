'use strict';
// look at http://scotch.io/tutorials/javascript/easy-node-authentication-google

// load all the things we need
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var repo = require("./../src/repository.js");

// load the auth variables
var configAuth = require('./auth');

module.exports = function (passport) {

  // used to serialize the user for the session
  passport.serializeUser(function (user, done) {
    done(null, user.google.email);
  });

  // used to deserialize the user
  passport.deserializeUser(function (id, done) {
    repo.getUser(id, function (err, user) {
      done(err, user);
    });
  });


  // =========================================================================
  // GOOGLE ==================================================================
  // =========================================================================
  passport.use(new GoogleStrategy({

      clientID: configAuth.googleAuth.clientID,
      clientSecret: configAuth.googleAuth.clientSecret,
      callbackURL: configAuth.googleAuth.callbackURL,

    },
    function (token, refreshToken, profile, done) {

      // make the code asynchronous
      // repo.getUser won't fire until we have all our data back from Google
      process.nextTick(function () {

        var email = profile.emails[0].value; // pull the first email
        // try to find the user based on their google id
        repo.getUser(email, function (err, user) {
          if (err) {
            return done(err);
          }
          if (user) {
            // if a user is found, log them in
            return done(null, user);
          } else {
            // if the user isn't in our database, create a new user
            var newUser = {};
            newUser.google = {};

            // set all of the relevant information
            newUser.google.email = email;
            repo.createUser(email, newUser, function (err) {
              if (err) {
                throw err;
              }
              return done(null, newUser);
            });
          }
        });
      });
    }));
};