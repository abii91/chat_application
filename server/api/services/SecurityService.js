var argon2 = require('argon2');
var jwt = require('jsonwebtoken');
var defer = require('node-defer');

module.exports = {
  secret: sails.config.jwtSettings.secret,
  issuer: sails.config.jwtSettings.issuer,
  audience: sails.config.jwtSettings.audience,

  /**
  * Hash the password field of the passed user.
  */
  hashPassword: function (user) {
    var deferred = new defer();

    if(user.hasOwnProperty("password") && user.password != "") {
      argon2.hash(user.password).then(hash => {
        user.password = hash;
        deferred.resolve();
      }).catch(err => {
        console.log(err);
        deferred.reject(err);
      });
    }else{
      deferred.resolve();
    }
    return deferred.promise();
  },

  /**
  * Compare user password hash with unhashed password
  * @returns boolean indicating a match
  */
  comparePassword: function(password, user, next){
    var deferred = new defer();

    argon2.verify(user.password, password).then(match => {
      if(null == next){
        return deferred.resolve(match);
      }

      if (match) {
        return next(null, user, {});
      } else {
        return next(null, false, {
          code: 'E_WRONG_PASSWORD',
          message: 'Username or Password is wrong'
        });
      }

    }).catch(err => {
      if(null == next){
        return deferred.reject(err);
      }

      return next(null, false, {
        code: 'E_WRONG_PASSWORD',
        message: 'Username or Password is wrong'
      });
    });

    if(null == next){
      return deferred.promise();
    }
  },

  /**
  * Create a token based on the passed user
  * @param user
  */
  createToken: function(user)
  {
    return jwt.sign({
      user: user.toJSON()
    },
    sails.config.jwtSettings.secret,
    {
      algorithm: sails.config.jwtSettings.algorithm,
      expiresInMinutes: sails.config.jwtSettings.expiresInMinutes,
      issuer: sails.config.jwtSettings.issuer,
      audience: sails.config.jwtSettings.audience
    }
  );
}
};
