/**
* AuthController
* @description :: Server-side logic for manage user's authorization
*/

var passport = require('passport');

/**
* Triggers when user authenticates via passport
* @param {Object} req Request object
* @param {Object} res Response object
* @param {Object} error Error object
* @param {Object} user User profile
* @param {Object} info Info if some error occurs
* @private
*/
function _onPassportAuth(req, res, error, user, info) {
  if (error) return res.serverError(error);
  if (!user) return res.unauthorized(null, info && info.code, info && info.message);

  return res.ok({
    // TODO: replace with new type of cipher service
    token: SecurityService.createToken(user),
    user: user
  });
}

module.exports = {
  /**
  * Sign up in system
  * @param {Object} req Request object
  * @param {Object} res Response object
  */
  signup: function (req, res) {

    Users.findOne({ 'or': [ {email: req.param('email')}, {user_name: req.param('user_name')}] })
    .exec(function (error, user){
      if (error) return res.serverError;
      if(null == user){
        Users
        .create(_.omit(req.allParams(), 'id'))
        .then(function (user) {
          return {
            // TODO: replace with new type of cipher service
            token: SecurityService.createToken(user),
            user: user
          };
        })
        .then(res.created)
        .catch(res.serverError);
      }
      else {
        if(req.param('user_name') == user.user_name){
          res.unqiueViolation({field_name: 'user name', field_value: req.param('user_name')});
        }
        else if(req.param('email') == user.email){
          res.unqiueViolation({field_name: 'email', field_value: req.param('email')});
        }
      }
    });
  },

  /**
  * Sign in by local strategy in passport
  * @param {Object} req Request object
  * @param {Object} res Response object
  */
  UserLogin: function (req, res) {
    passport.authenticate('local', _onPassportAuth.bind(this, req, res))(req, res);
  },

};
