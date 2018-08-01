// pg pooling

const { Pool } = require('pg');

const pool = new Pool({
	user: 'node',
	// host: '192.168.56.2',
	host: '127.0.0.1',
	database: 'world',
	password: 'javascript',
	// port: 3211
	port: 5432
})

console.log("pool initialized");
module.exports = () => { return pool; }
	
	// return pool.query('SELECT * FROM city LIMIT 10;')
	// 	.then(function(res) {
	// 		console.log("debug1");
	// 		console.log(res.rows)
	// 	})
	// 	.catch(function(err) {
	// 		console.log("debug2");
	// 		console.error('Error executing query', err.stack);
	// 	});