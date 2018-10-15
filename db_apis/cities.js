// const pool = require('../services/pgdatabase').pool;
const pgdatabase = require('../services/pgdatabase');

// const query = "SELECT * FROM city LIMIT 10;";


const baseQuery =
		`SELECT
				c.id
				,c.name
				,c.countrycode
				,c.district
				,c.population
				,COUNT(*) OVER() AS FULLCOUNT
		FROM city AS c`;

module.exports.find = (context) => {
	console.log("db_apis/cities.find")

	const binds = {};

	query = baseQuery + `\nWHERE 1=1`;

	if (context.id) {
		binds.id = context.id;
		query = query +
				`\nAND c.id = '${binds.id}'`;
	}
	if (context.name) {
		binds.name = context.name;
		query = query +
				`\nAND c.name = '${binds.name}'`;
	}
	// Using UPPER on both column and parameter makes it case insensitive
	if (context.countrycode) {
		binds.countrycode = context.countrycode;
		query = query +
				`\nAND UPPER(c.countrycode) = UPPER('${binds.countrycode}')`;
	}
	if (context.district) {
		binds.district = context.district;
		query = query +
				`\nAND c.district = '${binds.district}'`;
	}

	if (context.pagesiz && context.pagenum) {
		binds.pagesiz = context.pagesiz;
		binds.pagenum = context.pagenum;

		query = query +
			`\nLIMIT ${binds.pagesiz} OFFSET ((${binds.pagenum} - 1) * ${binds.pagesiz})`;
	}
	

	return pgdatabase.simpleExecute(query)
		// .then(results => {
		// 	console.log("results: " + JSON.stringify(results));
		// })
		// .then(results => {
		// 	return results.rows;
		// })
		.catch(error => {
			console.log("Error during simpleExecute: " + error);
		})
}

const cursorPrefix = `BEGIN; DECLARE city_cursor CURSOR FOR`;

const baseQueryc =
		`\nSELECT
				c.id
				,c.name
				,c.countrycode
				,c.district
				,c.population
		FROM city AS c`;

module.exports.findc = (context) => {
	console.log("db_apis/cities.find")

	const binds = {};

	query = baseQueryc + `\nWHERE 1=1`;

	if (context.id) {
		binds.id = context.id;
		query = query +
				`\nAND c.id = '${binds.id}'`;
	}
	if (context.name) {
		binds.name = context.name;
		query = query +
				`\nAND c.name = '${binds.name}'`;
	}
	// Using UPPER on both column and parameter makes it case insensitive
	if (context.countrycode) {
		binds.countrycode = context.countrycode;
		query = query +
				`\nAND UPPER(c.countrycode) = UPPER('${binds.countrycode}')`;
	}
	if (context.district) {
		binds.district = context.district;
		query = query +
				`\nAND c.district = '${binds.district}'`;
	}

	if (context.pagesiz && context.pagenum) {
		binds.pagesiz = context.pagesiz;
		binds.pagenum = context.pagenum;
		binds.offset  = ((binds.pagenum - 1) * binds.pagesiz);

		query = cursorPrefix + query +
		`\n; MOVE ABSOLUTE ${binds.offset} FROM city_cursor; FETCH ${binds.pagesiz} FROM city_cursor; COMMIT;`;
		// `\nLIMIT ${binds.pagesiz} OFFSET ((${binds.pagenum} - 1) * ${binds.pagesiz})`;
	}
	else {
		query = query + `;\n`
	}


	return pgdatabase.simpleExecute(query)
		// .then(results => {
		// 	console.log("results: " + JSON.stringify(results));
		// })
		// .then(results => {
		// 	return results.rows;
		// })
		.catch(error => {
			console.log("Error during simpleExecute: " + error);
		})
}

module.exports.create = (context) => {
	console.log("db_apis/cities.create")
	console.log("city to be created: " + JSON.stringify(context));

	const name			= context.name;
	const countrycode	= context.countrycode;
	const district		= context.district;
	const population	= context.population;

	var query = `INSERT INTO city
				(id
				,name
				,countrycode
				,district
				,population)
				VALUES
				(nextval('city_id_seq')
				,'${name}'
				,'${countrycode}'
				,'${district}'
				,'${population}');`;

	return pgdatabase.transactionExecute(query)
		// .then(results => {
		// 	console.log("results: " + JSON.stringify(results));
		// })
		.then( () => {
			console.log("ughhhhh");
		})
		.catch(error => {
			console.log("Error during simpleExecute: " + error);
		})
}
