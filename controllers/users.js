const users = require('../db_apis/users.js');
// const { validationResult } = require('express-validator/check');

// this should be a protected route ??

 module.exports.get = function get(req, res, next) {
 	console.log("Users GET service");
	console.log(JSON.stringify(req.params));

	// get these from /facturas?serie=F/T&numdoc=123
	const context = {
		userid : req.body.userid,
		username : req.body.username
	};

	console.log("context being sent to api: " + JSON.stringify(context));

	return res.status(200).json({a: "b"});
	/*
	return users.find(context)
		.then(function(rows) {
			if(rows.length > 0) {
				res.status(200).json( { results : rows } );
			}
			else {
				res.status(404).end();
			}
		})
		.catch(next);
 	*/
 }