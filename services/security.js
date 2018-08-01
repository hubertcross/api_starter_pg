	const bcrypt = require('bcrypt');
	const jwt = require('jsonwebtoken');
	const config = require('../config/security.js');

	function hashPassword(password) {
		return new Promise((resolve, reject) => {
			bcrypt.genSalt(config.saltRounds)
				.then(salt => {
					return bcrypt.hash(password, salt);
				})
				.then(resolve)
				.catch(reject);
		});
	}

	module.exports.hashPassword = hashPassword;

	module.exports.validatePassword = bcrypt.compare;

	// What should this user object contain in our case?
	// This function should be called once we need a token, meaning the user has logged in correctly
	function getSessionToken(user) {
		return new Promise((resolve, reject) => {
			console.log("user for token generation: " + JSON.stringify(user));
			const payload = {
				sub: user.USERNAME,
				roles: user.roles
			};
			console.log("payload for token generation: " + JSON.stringify(payload));
			// What else should the config object contain? check jwt documentation
			jwt.sign(payload, config.secret, { expiresIn: config.sessionExpiresIn }, function(err, token) {
				if (err) {
					console.log("Error from callback: " + err)
					reject(err);
					return;
				}
				console.log("token: " + token);

				resolve(token);
			});
		});
	}

	module.exports.getSessionToken = getSessionToken;

	// modified Dan McGhan's function to handle multiple roles
	module.exports.authenticate_multirole = function authenticate_multirole(role) {
		// we follow the familiar express middle-ware pattern
		return function(req, res, next) {
			if (!req.headers.authorization) {
				res.status(401).json({ message : 'You are not authorized' } );
				return;
			}

			const token = req.headers.authorization;
			console.log("-----JWT-----");
			console.log("Token to process: " + JSON.stringify(token));

			jwt.verify(token, config.secret, function(err, payload) {
				if (err) {
					if (err.name === 'TokenExpiredError') {
						res.status(401).json( { message : 'Token Expired' });
					}
					else {
						res.status(401).json( { message : 'Authentication failed'} );
					}

					return;
				}
				console.log("Payload: " + JSON.stringify(payload));

				// Check if the specified role is present in the user's array of roles
				if (payload['roles'].indexOf(role) != -1) {
				// if (!role || role === payload.role) {
					// pass some user details through in case they are needed
					req.user = {
						email: payload.sub,
						role: payload.role
					};
					// user is who they say they are so jump to next step in middle-ware
					console.log("JWT is valid. Going to next middleware.")
					next();
				}
				else {
					res.status(401).json( { message : 'You are not authorized' } );
				}
			});
		}
	}


	// this is a function that returns functions which are unique based on the role they're passed
	// tries to identify the user based on the contents of the JWT
	module.exports.authenticate_jwt = function authenticate_jwt(role) {
		// we follow the familiar express middle-ware pattern
		return function(req, res, next) {
			if (!req.headers.authorization) {
				res.status(401).json({ message : 'You are not authorized' } );
				return;
			}

			const token = req.headers.authorization;
			console.log("-----JWT-----");
			console.log("Token to process: " + JSON.stringify(token));

			jwt.verify(token, config.secret, function(err, payload) {
				if (err) {
					if (err.name === 'TokenExpiredError') {
						res.status(401).json( { message : 'Token Expired' });
					}
					else {
						res.status(401).json( { message : 'Authentication failed'} );
					}

					return;
				}
				// because we are handling multiple roles, we must check if the specified role
				// is *in* the array of user's roles 20180202
				if (!role || role === payload.role) {
					// pass some user details through in case they are needed
					req.user = {
						email: payload.sub,
						role: payload.role
					};
					// user is who they say they are so jump to next step in middle-ware
					console.log("JWT is valid. Going to next middleware.")
					next();
				}
				else {
					res.status(401).json( { message : 'You are not authorized' } );
				}
			});
		}
	}

	// just auth while this gets implemented

	function authenticate() {
		return function(req, res, next) {
			console.log("authenticating");
			next();
		}
	}

	function assertValidSortOrder(sortOrder) {
		if (sortOrder == 'ASC' || sortOrder == 'DESC') {
			return sortOrder;
		}
		else {
			return 'ASC';
		}
	}

	module.exports.assertValidSortOrder = assertValidSortOrder;
	module.exports.authenticate = authenticate;