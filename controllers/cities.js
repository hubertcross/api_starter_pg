const cities = require('../db_apis/cities');

/*
In this controller we should have the following:
1) get (select everything if no conditions and if no pagination options given, or page if so)
2) post (create with given attributes)
3) put (update a single row, by ID, with given attributes)
4) delete (delete a set of rows. if no row is specified, no row is deleted)
*/


module.exports.get = function get(req, res, next) {
 	console.log("Cities GET service");

	const context = {
		id : req.query.id,
		name : req.query.name,
		countrycode : req.query.countrycode,
		district : req.query.district,
		pagesiz : req.query.pagesiz,
		pagenum : req.query.pagenum
	};

	console.log("context: " + JSON.stringify(context));
//https://stackoverflow.com/questions/39059990/reusing-pg-pool-via-module-exports

	return cities.find(context)
		.then(function(results) {
			// for cursor pagination
			if(results[3] && results[3]['rowCount'] > 0) {
				res.status(200).json( results[3] );
			}
			else if (results && results['rowCount'] > 0) {
				res.status(200).json( results );
			}
			else {
				res.status(404).end();
			}
		})
		.catch(next);
 }

//const pool = require('../services/pgpool');

module.exports.post = (req, res, next)  => {
	console.log("controllers/cities.post");
	console.log("req.body: " + JSON.stringify(req.body));

	// THIS IS BROKEN
	// const errors = validationResult(req);
	// if (!errors.isEmpty()) {
	// 	return res.status(422).json({ errors: errors.mapped() });
	// }
	console.log("balls");

	const city = {
		name: req.body.name,
		countrycode: req.body.countrycode,
		district: req.body.district,
		population:	req.body.population
	};

	// this is called "early return" - and specifically since it's a failure condition,
	// it's sometimes referred to as a "guarded function"
	// if ( !(city.name && city.countrycode && city.district && city.population) ) {
	// 	return res.status(400).end();
	// }

	return cities.create(city)
	.then( () => {
		console.log("bleh");
		res.status(200).end();
	})
	.catch( (err) => {
		console.log("caught : " + err);
	});
}

// Porting to async
// Should use prepared/parameterized statements

// module.exports.post = (req, res, next)  => {
// 	console.log("db_apis/cities.create");

// 	(async () => {
// 	  // note: we don't try/catch this because if connecting throws an exception
// 	  // we don't need to dispose of the client (it will be undefined)
// 	  const client = await pool().connect()

// 	  try {
// 	    await client.query('BEGIN')
// 	    const { rows } = await client.query('INSERT INTO person (name, city) VALUES($1, $2) RETURNING id', ['Donald Fleury', 1])

// 	    // const insertPhotoText = 'INSERT INTO photos(user_id, photo_url) VALUES ($1, $2)'
// 	    // const insertPhotoValues = [res.rows[0].id, 's3.bucket.foo']
// 	    // await client.query(insertPhotoText, insertPhotoValues)
// 	    await client.query('COMMIT')
// 	  } catch (e) {
// 	    await client.query('ROLLBACK')
// 	    throw e
// 	  } finally {
// 	    client.release()
// 	  }
// 	})().catch(e => console.error(e.stack))	
// }