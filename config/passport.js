const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('users');
mongoose.set('strictQuery', false);// to avoid DeprecationWarning: Mongoose
const keys = require('./keys');
//const { Done } = require('@material-ui/icons');

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secret; //secretOrkey is built in methode to use only secret or key 


module.exports = passport => {
 
  passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    console.log(jwt_payload)
    User.findById(jwt_payload.id)
      .then(user => {
        if (user) {
           
          return done(null, user);
        }
        return done(null, false);
      })
      .catch(err => console.log(err));
  }));
};