// use express-validator v4
const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');

// declare validation arrays here instead of in router.js

const postballs = [

  check('username')
    // Every validator method in the validator lib is available as a
    // method in the check() APIs.
    // You can customize per validator messages with .withMessage()
    .isEmail().withMessage('must be an email')
 
    // Every sanitizer method in the validator lib is available as well!
    .trim()
    .normalizeEmail()//,
 
    // ...or throw your own errors using validators created with .custom()
    // .custom(value => {
    //   return findUserByEmail(value).then(user => {
    //     throw new Error('this email is already in use');
    //   })
    // })
	// ,
 
  // // General error messages can be given as a 2nd argument in the check APIs
  // check('password', 'passwords must be at least 5 chars long and contain one number')
  //   .isLength({ min: 5 })
  //   .matches(/\d/),
 
  // // No special validation required? Just check if data exists:
  // check('addresses.*.street').exists(),
 
  // // Wildcards * are accepted!
  // check('addresses.*.postalCode').isPostalCode(),
 
  // // Sanitize the number of each address, making it arrive as an integer
  // sanitize('addresses.*.number').toInt()
];

function postValidator(req, res, next) {
	const errors = validationResult(req);
  	if (!errors.isEmpty()) {
    	return res.status(422).json({ errors: errors.mapped() });
  	}
  	else {
  		next();
  	}
}
module.exports.postValidator = postValidator;
module.exports.postballs = postballs;