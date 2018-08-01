var sql = require('mssql');
// handle connection pool creation and reutilization

var config = {
    user: 'username',
    password: 'password',
    server: 'IP.ADDRESS', // You can use 'localhost\\instance' to connect to named instance 
    database: 'DATABASE_NAME',
    requestTimeout: 30000,
    options: {
        encrypt: false // Use this if only you're on Windows Azure 
    }
} 

// config.parseJSON =true
// var sql = require('mssql')
// const secret= 'mysec'
// const saltRounds = 10;
 
function getConnectionPoolGlobal() {
    function connect(resolve,reject) {
        if (global.connectionPool) {
            console.log('Reutilizando pool ' + connectionPool.listenerCount())
            resolve(connectionPool)
        }
        else{
        	new sql.ConnectionPool(config).connect()
       		.then(poolObt=>{
            	global.connectionPool = poolObt
            	resolve(global.connectionPool)
            	console.log('Nuevo pool Creado')
        	})
        	.catch(err =>{
            	reject(err)
        	})
        }      
    }
    return new Promise(connect)
}
 
// function getConnectionPool(config,sql) {
//     function getpool(resolve,reject) {
//         new sql.ConnectionPool(config).connect()
//         .then(pool=>{
//             resolve(pool)
//         })
//         .catch(err =>{
//             reject(err)
//         })
//     }
//     return new Promise(getpool)
// }

module.exports={
    "config":config,
    // "getConnectionPool":getConnectionPool,
    "getConnectionPoolGlobal":getConnectionPoolGlobal,
};




/*
// **************************         MULTIPLES CONNECTIONS POOLS     ************
 
//Modificar o crear variable en app.js
global.poolsGlobal={};
 
//Agregar clave nConnection para el nombre de la conexion
const configs = {server:{
    nConnection:'server',
    user: 'web',
    password: '',
    server: '1', // You can use 'localhost\\instance' to connect to named instance
    database: 'Testing20172018',
    port: '1433',
    connectionTimeout:1000 ,
    options: {
        trustedConnection: true
      },
    parseJSON: true
},local:{
    nConnection:'local',
    user: 'node',
    password: 'node',
    server: '127.0.0.1', // You can use 'localhost\\instance' to connect to named instance
    database: 'nodeapi_testdb',
    port: '1433',
    connectionTimeout:1000 ,
    options: {
        trustedConnection: true
      },
    parseJSON: true
}};
 
function getConnectionPoolGlobalByConf(config){
    function Connect(resolve,reject){
        if (global.poolsGlobal[config.nConnection]){
            console.log('Reutilizando pool '+config.nConnection+','+poolsGlobal[config.nConnection].listenerCount())
            // console.log(pooslGlobal[config.nConnection])
            resolve(poolsGlobal[config.nConnection])
        }
        else{
            new sql.ConnectionPool(config).connect().then(poolObt=>{
            global.poolsGlobal[config.nConnection]=poolObt
            resolve(global.poolsGlobal[config.nConnection])
            console.log('Nuevo pool Creado')
            }).catch(err =>{
            reject(err)
            })
        }
    }
    return new Promise(Connect)
}
 
//el uso es igual solo que se envia la configuracion, EJ
const config = require('../config/configMSSQL')
config.getConnectionPoolGlobalByConf(config.configs.server).then(poolObt=>{
*/