var cp = require("../lib/connectionPool.js");
const sql = require('mssql');

/*
 *	Append Stored Procedure parameter triplets to array of JSON that is passed to database.storedProcExecute.
 *
*/ 
function pushAOJParam(aoj, name, type, value) {
	aoj[aoj.length] = {
		pName: name,
		pType: type,
		pData: value
	}
}

// serie must be padded to 7 0's for SCM
// http://stackoverflow.com/questions/10073699/pad-a-number-with-leading-zeros-in-javascript
function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

module.exports.pushAOJParam = pushAOJParam;

function simpleExecute(query) {
	console.log("simpleExecute query: " + query);
	return cp.getConnectionPoolGlobal()
	.then(function(pool) {
		return pool.request()
			.query(query);
	})
	.catch(function(err) {
		throw(err);
	})
}

module.exports.simpleExecute = simpleExecute;

function storedProcExecute(spName, parametersJsonArray) {
	console.log('stored proc execute');
		return cp.getConnectionPoolGlobal()
		.then(function(pool) {	
	        request = new sql.Request(pool)
	        request.verbose = true;

	        for (var i = 0; i < parametersJsonArray.length; i++) {
	        	request.input(
	        		parametersJsonArray[i]['pName'],
	        		parametersJsonArray[i]['pType'],
	        		parametersJsonArray[i]['pData']);
	        }

	        // request.input('mNumero', sql.Int, CTDDjson.numreg)
	        return request.execute(spName);			
		})
		// .then(function(rows) {
		// 	console.log("results: " + JSON.stringify(rows));
		// })
		.catch(function(err) {
			console.log("Rejection: " + err);
		})
}
module.exports.storedProcExecute = storedProcExecute;


// takes an array of json, cycles through them to set the stored procedure's input parameters,
function storedprocExecute_trans(spName, parametersJsonArray, transaction) {
		return cp.getConnectionPoolGlobal()
		.then(function(pool) {	
	        request = new sql.Request(transaction)
	        request.verbose = true;

	        for (var i = 0; i < parametersJsonArray.length; i++) {
	        	request.input(
	        		parametersJsonArray[i]['pName'],
	        		parametersJsonArray[i]['pType'],
	        		parametersJsonArray[i]['pData']);
	        }
	        console.log("Executing transactional stored procedure \n" +
	        	spName + " with parameters: \n" +
	        	JSON.stringify(parametersJsonArray));
	        return request.execute(spName);			
		})
}

// function executeArrayProcedures(arrayRequest, iteration, transaction, numreg, numdoc) {
function executeArrayProcedures(arrayRequest, iteration, transaction, liveDataObj) {

    var max = arrayRequest.length - 1;
    console.log(iteration + ' | ' + max)
    function executeProce(resolve, reject) {
    	request = transaction.request();
    	request.verbose = true;

        console.log("Traversing array of parameter AOJ's: " + JSON.stringify(arrayRequest[iteration]['params']));

        for (var i = 0; i < arrayRequest[iteration]['params'].length; i++) {
        	console.log("Parameter : " + JSON.stringify(arrayRequest[iteration]['params'][i]) + "\n");
        	request.input(arrayRequest[iteration]['params'][i]['pName'],
        								arrayRequest[iteration]['params'][i]['pType'],
        								arrayRequest[iteration]['params'][i]['pData']
        								);
        }

        console.log(JSON.stringify(arrayRequest[iteration]));
        // console.dir(request);
        console.log("WTF: " + arrayRequest[iteration]['spName'])
        return request.execute(arrayRequest[iteration]['spName'])
        .catch(function(err) {
        	console.log("Caught 123: " + err);
        	throw(err);
        })
        .then((results) => {
            console.log('Procedimiento Ejecutado!');
            if (iteration == max) {
            	console.log("resolving");
            	// need to resolve here for the the LAST iteration call
                resolve(results);
            } else {
                iteration++;
                console.log("recursive calling");
                executeArrayProcedures(arrayRequest, iteration, transaction, liveDataObj)
                .catch((err) => {
                	reject(err);
                })
                .then((results) => {
                	// need to resolve here for all calls except the LAST one
                	resolve(results);
                })
            }
        }).catch((err) => {
           console.log('************* ERROR ***********');
           console.dir(err.message);
           reject(err);
        })
    } // executeProce
    return new Promise(executeProce);
}

function executeBulkInserts(bulkParamArray, iteration, transaction, liveDataObj) {

    var max = bulkParamArray.length - 1;
    console.log(iteration + ' | ' + max)
    function executeProce(resolve, reject) {
    	request = transaction.request();
    	request.verbose = true;
    	console.log("creating table");
    	var table = new sql.Table(bulkParamArray[iteration]['dbTableName']);
    	console.log("adding columns");
		for (var i = 0; i < bulkParamArray[iteration]['columns'].length; i++) {
			console.log("Column #" + i + " - " + bulkParamArray[iteration]['columns'][i]['colName'] + " | " + bulkParamArray[iteration]['columns'][i]['colType']);
			table.columns.add(
				bulkParamArray[iteration]['columns'][i]['colName'],
				eval(bulkParamArray[iteration]['columns'][i]['colType']),
				{ nullable : bulkParamArray[iteration]['columns'][i]['colNull'] });
		}

		console.log("Added columns");

		var rowsArray = [];
		for (var k = 0; k < bulkParamArray[iteration]['numRows']; k++) {
			console.log("Adding row: " + JSON.stringify(rowsArray));
			rowsArray = [];
			for (var j = 0; j < bulkParamArray[iteration]['columns'].length; j++) {
				rowsArray[rowsArray.length] = bulkParamArray[iteration]['columns'][j]['colVals'][k];
			}
			console.log("rowsArray: " + JSON.stringify(rowsArray));
			console.log("table.rows.add(" + rowsArray.join() + ");" );
			eval("table.rows.add(" + rowsArray.join() + ");" );
		}			

		console.dir(table);
		console.log("Executing bulk insert");
        return request.bulk(table)
        .catch(function(err) {
        	console.log("Caught 123: " + err);
        	throw(err);
        })
        .then((results) => {
            console.log('Bulk insert done');
            if (iteration == max) {
            	console.log("resolving");
            	// need to resolve here for the the LAST iteration call
                resolve(results);
            } else {
                iteration++;
                console.log("recursive calling");
                executeBulkInserts(bulkParamArray, iteration, transaction, liveDataObj)
                .catch((err) => {
                	reject(err);
                })
                .then((results) => {
                	// need to resolve here for all calls except the LAST one
                	resolve(results);
                })
            }
        }).catch((err) => {
           console.log('************* ERROR ***********');
           console.dir(err.message);
           reject(err);
        })
    } // executeProce
    return new Promise(executeProce);
}


//module.exports.insertSCMDoc = function insertSCMDoc(spName, parametersJsonArray, aojActConsecutivo, bulkInsertAOJ, bulkInsertDataArray, bulkInsertDBTableName) {
module.exports.insertSCMDoc = function insertSCMDoc(aojActConsecutivo, AOAOJ, BPA, accountingData, sequenceRequirements) {	
	//console.log("bleh: " + JSON.stringify(parametersJsonArray));
	console.log("bleh: " + JSON.stringify(AOAOJ));
	return cp.getConnectionPoolGlobal()
	.then(function(pool) {
		const transaction = pool.transaction();
		return insertSCMDocTransction(transaction, aojActConsecutivo, AOAOJ, BPA, accountingData, sequenceRequirements)
		.catch(function(err) { 
			console.log("caught1234: " + err);
			throw("Call to insertSCMDocTransaction failed");
		})
		// .then(function(rows) {
			//console.log("results: " + JSON.stringify(rows));
			//res.json(rows);
		// })
	}) // cp then
}

// Create documents that require NumReg and NumAct
function insertSCMDocTransction(transaction, aojActConsecutivo, AOAOJ, BPA, accountingData, sequenceRequirements) {
	return new Promise((resolve, reject) => {
		// var status;
		transaction.begin(err => {
	        if (err) {
	            console.log("err" + err);
	        }
	        var rolledBack = false;
	        transaction.on('rollback', function(aborted) {
	            rolledBack = true;
	            console.log("set rolledBack to false")
	        })

			var obj = {};
			console.log("wtf");
			Promise.resolve()
			.then(() => {
            	console.log('Num Reg: ' + obj.numreg  + "; Num Doc: " + obj.ActConsecutivo + "; Num Reg D: " + obj.numregd);
            	return executeArrayProcedures(AOAOJ, 0, transaction, obj);
            	// return executeArrayProcedures(AOAOJ, 0, transaction, obj);
            })
            .then(function() {
            	// return executeBulkInserts(BPA, 0, transaction, obj.numreg, obj.ActConsecutivo, obj);
            	return executeBulkInserts(BPA, 0, transaction, obj);
            })
			.then(function() {
				console.log("COMMITTING ...");
				transaction.commit(function(err) {
					if (err) {
						console.log("Error while attempting to commit: " + err);	
					}
					else {
						console.log("Committed without error.")
						console.log('Num Reg: ' + obj.numreg  + "; Num Doc: " + obj.ActConsecutivo + "; Num Reg D: " + obj.numregd);
					}
				})
				resolve(obj);
			}) // req exec then
			.catch(function(err) {
				// status = "ERROR";
				console.log("Caught error: " + err)
		        if (err) {
		            if (!rolledBack) {
		                console.log("ROLLING BACK");
							transaction.rollback(function(err1) {
		                	console.log("error: " + err);
		                    if (err) {
		                        console.log("Error while rolling back: " + err1);
		                    } 
		                    else {
		                    	console.log("Rolled back without error.");
		                    }
		                })
		                reject(err);
		            }
		            else {
		                console.log("already rolledback");
		            }
		        }
			})
		}) // transaction begin		
	})
}