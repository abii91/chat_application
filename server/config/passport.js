
/**
* Passport configuration file where you should configure all your strategies
* @description :: Configuration file where you configure your passport authentication
*/
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var JwtStrategy = require('passport-jwt').Strategy;
var FacebookTokenStrategy = require('passport-facebook-token').Strategy;

var EXPIRES_IN_MINUTES = 60 * 24;
var SECRET = process.env.tokenSecret || "4ukI0uIVnB3iI1yxj646fVXSE3ZVk4doZgz6fTbNg7jO41EAtl20J5F7Trtwe7OM";
var ALGORITHM = "HS256";
var ISSUER = "nozus.com";
var AUDIENCE = "nozus.com";


/**
* Configuration object for local strategy
* @type {Object}
* @private
*/
var LOCAL_STRATEGY_CONFIG = {
  usernameField: 'user_name',
  passwordField: 'password',
  passReqToCallback: false
};

/**
* Configuration object for JWT strategy
* @type {Object}
* @private
*/
var JWT_STRATEGY_CONFIG = {
  secretOrKey: SECRET,
  issuer : ISSUER,
  audience: AUDIENCE,
  passReqToCallback: false
};

/**
* Configuration object for social strategies
* @type {Object}
* @private
*/
var SOCIAL_STRATEGY_CONFIG = {
  clientID: '-',
  clientSecret: '-',
  consumerKey: '-',
  consumerSecret: '-',
  passReqToCallback: true
};

/**
* Triggers when user authenticates via local strategy
* @param {String} user_name  from body field in request
* @param {String} password  from body field in request
* @param {Function} next Callback
* @private
*/
function _onUserLocalStrategyAuth(user_name, password, next) {
  Users.findOne({user_name: user_name})
  .populate("role_id")
  .then(function (user) {

    if (!user) return next(null, false, {
      code: 'E_WRONG_PASSWORD',
      message: 'Username or Password is wrong'
    });

    // TODO: replace with new cipher service type
    SecurityService.comparePassword(password, user, next);
  })
  .catch(function(error){
    return next(error, false, {});
  });
}

/**
* Triggers when user authenticates via JWT strategy
* @param {Object} payload Decoded payload from JWT
* @param {Function} next Callback
* @private
*/
function _onJwtStrategyAuth(payload, next) {

  var user = payload.user;

  return next(null, user, {});
}

passport.use('local', new LocalStrategy(LOCAL_STRATEGY_CONFIG, _onUserLocalStrategyAuth));
passport.use(new JwtStrategy(JWT_STRATEGY_CONFIG, _onJwtStrategyAuth));

module.exports.jwtSettings = {
  expiresIn: EXPIRES_IN_MINUTES,
  secret: SECRET,
  algorithm : ALGORITHM,
  issuer : ISSUER,
  audience : AUDIENCE
};
