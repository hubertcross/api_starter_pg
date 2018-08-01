//const pool = require('../services/pgdatabase');
const cities = require('../db_apis/cities');

const query = "SELECT * FROM city LIMIT 10;";

 module.exports.get = function get(req, res, next) {
 	console.log("Cities GET service");

	const context = {
		id : req.body.id
	};

	console.log("wtf1");
//https://stackoverflow.com/questions/39059990/reusing-pg-pool-via-module-exports


	return cities.find(context)
		.then(function(results) {
			if(results['rowCount'] > 0) {
				res.status(200).json( results );
			}
			else {
				res.status(404).end();
			}
		})
		.catch(next);
 }