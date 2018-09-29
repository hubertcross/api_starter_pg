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

// const closeParen = '\n' + `)` + '\n';

// const baseQuery = 
// 	`SELECT
// 		 USERS.USERID
// 		,USERS.USERNAME
// 		,USERS.HASHSTRING
// 		,USERS.ISENABLED
// 		,USERS.CREATED_AT
// 		,USERS.MODIFIED_AT
// 		,ROW_NUMBER() OVER (ORDER BY USERID ASC) as RowNumber
// 	FROM dbo.[SCMAPI_auth_users] AS USERS`;

// const paginatorSuffix =  '\n' +
// 	`SELECT * 
//        -- get the total records so the web layer can work out
//        -- how many pages there are
//        , (SELECT COUNT(*) FROM CTE) AS TotalRecords
// 	FROM CTE
// 	WHERE RowNumber BETWEEN @FirstRow AND @LastRow
// 	ORDER BY RowNumber ASC
// 	`;	

// module.exports.find = function find(context) {
// 	return new Promise(function(resolve, reject) {
// 		let query = '';
// 		const binds = {};

// 		console.log("context : " + JSON.stringify(context));

// 		if ( !(Object.keys(context).length === 0 && context.constructor === Object)) {

// 			if (context.pagesiz && context.pagenum) {

// 				binds.pagesiz = context.pagesiz;
// 				binds.pagenum = context.pagenum;		

// 				const paginatorPrefix = '\n' +
// 					`DECLARE @FirstRow INT, @LastRow INT
// 					SELECT	@FirstRow   = ((${binds.pagenum} - 1) * ${binds.pagesiz} ) + 1,
// 				    		@LastRow    = ((${binds.pagenum} - 1) * ${binds.pagesiz}) + ${binds.pagesiz}
// 				    		;
// 				    WITH CTE AS (
// 					`;				
// 				query = paginatorPrefix;
// 			}

// 			query = query + baseQuery +
// 					`\nWHERE 1=1`; // need 1=1 to put AND before each bind condition
					
// 			if (context.userid) {
// 				binds.userid = context.userid;
// 				query = query +
// 					`\nAND USERS.USERID = '${binds.userid}'`;
// 			}
// 			if (context.username) {
// 				binds.username = context.username;
// 				query = query +
// 					`\nAND USERS.USERNAME = '${binds.username}'`;
// 			}
// 			if (context.isEnabled) {
// 				binds.username = context.username;
// 				query = query +
// 					`\nAND USERS.isEnabled = 1`;
// 			}						
// 			if (context.pagesiz && context.pagenum) {
// 				query = query + closeParen;
// 				query = query + paginatorSuffix;
// 			}						
// 		}

// 		return database.simpleExecute(query)
// 			.then(rows => resolve(rows.recordset))
// 			.catch(reject);
// 	});
// }
