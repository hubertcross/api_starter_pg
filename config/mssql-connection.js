var config = {
    user: 'web',
    password: '19461946',
    server: '192.168.44.110', // You can use 'localhost\\instance' to connect to named instance 
    database: 'Testing20172018',
    requestTimeout: 30000,
    options: {
        encrypt: false // Use this if only you're on Windows Azure 
    }
}

module.exports.config = config;