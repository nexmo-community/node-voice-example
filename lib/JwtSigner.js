var uuid = require('node-uuid');
var jwt = require('jsonwebtoken');

function sign(cert, applicationId) {
  var toSign = {
    'iat': Date.now(),
		'application_id': applicationId,
		 "jti": uuid.v1()
	};
  
  var token = jwt.sign(toSign, cert, {algorithm: 'RS256'});
  return token;
}

module.exports = sign;
