// date formatting functions
const moment = require('moment');

module.exports.date_to_NUM_MOV = function date_to_NUM_MOV(dateString) {
    var date = new Date();
    // var formattedDate = moment(date).format('YYYY-MM-DD HH:mm:ss');
    if (dateString) {
    	var formattedDate = module.exports.padString(moment(date).format('YYMMDD'), 7);
    	console.log("ugh: " + formattedDate)
    	return formattedDate;
    }
}

module.exports.roundMoney = function roundMoney(value) {
	return (Math.round(value*Math.pow(10,2)) / Math.pow(10,2)).toFixed(2);
}

// serie must be padded to 7 0's for SCM
// http://stackoverflow.com/questions/10073699/pad-a-number-with-leading-zeros-in-javascript
module.exports.padString = function padString(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}