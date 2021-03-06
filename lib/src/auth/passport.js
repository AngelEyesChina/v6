module.exports = function (passport, GoogleStrategy) {

// API Access link for creating client ID and secret:
// https://code.google.com/apis/console/
  var GOOGLE_CLIENT_ID = "603443802018-ds0eslevh7g9iob5m7ggie07oq4hoo3s.apps.googleusercontent.com";
  var GOOGLE_CLIENT_SECRET = "NCfhqEc7E1dhLm--GPzqBt52";


// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete Google profile is
//   serialized and deserialized.
  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  passport.deserializeUser(function (obj, done) {
    done(null, obj);
  });


// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
  passport.use(new GoogleStrategy({
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:9000/auth/google/callback"
    },
    function (accessToken, refreshToken, profile, done) {
      // asynchronous verification, for effect...
      process.nextTick(function () {

        // To keep the example simple, the user's Google profile is returned to
        // represent the logged-in user.  In a typical application, you would want
        // to associate the Google account with a user record in your database,
        // and return that user instead.
        //TODO: hanan remove the next 2 lines after finishing debug
        var util = require('util');
        console.log(util.inspect(profile, { showHidden: true, depth: null }));
        return done(null, profile);
      });
    }
  ));
}