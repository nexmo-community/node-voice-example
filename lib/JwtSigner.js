var uuid = require('node-uuid');
function sign() {
  var toSign = {
    'iat': Date.now(),
		'application_id': config.applicationId,
		 "jti": uuid.v1()
	};
  var token = jwt.sign(toSign, cert, { algorithm: 'RS256'});
  return token;
}
