const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;


const googleAuth = async () => {
  
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/user/dashboard",
}, (accessToken, refreshToken, profile, done) => {
    // Save user profile data to your database
    done(null, profile);
}));

// Serialize user information to maintain session
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

}

module.exports = googleAuth;



