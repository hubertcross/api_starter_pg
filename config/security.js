const secret = '1234568!@#';

// used for expiresIn
const algorithm = "HS256"; // default
const sessionExpiresIn = "1 day";
//const notBefore;
//audience
//issuer
//jwtid
//subject
//noTimestamp
//header
//keyid

module.exports.secret = secret;
module.exports.sessionExpiresIn = sessionExpiresIn;
