const express				= require('express');
const router				= express.Router();
const cors					= require('cors');
const validator				= require('./validator');
const security				= require('./security');
const users					= require('../controllers/users');
const cities				= require('../controllers/cities');

router.route('/auth/users')
	//.options(cors()) // enable pre-flight request for DELETE request
	.get(security.authenticate(), cors(), users.get)

router.route('/cities')
	//.options(cors()) // enable pre-flight request for DELETE request
	.get(security.authenticate(), cors(), cities.get)
	.post(validator.postCities, validator.postValidator, security.authenticate(), cors(), cities.post)	
	// .post(security.authenticate(), cors(), cities.post)	


module.exports = router;