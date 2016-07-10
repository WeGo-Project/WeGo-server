var mysql = require('mysql')

mysqlPool = mysql.createPool({
    //user: 'root',
    //password: 'root',
    database: 'wego',
    user: 'admin',
    password: 'password',
    host: '119.29.235.26'
});

console.log('database connection pool set up');

var DBPool = {};
DBPool.getConnection = function(callback) {
    mysqlPool.getConnection(function(err, connection) {
        callback(err, connection);
        if (connection) {
            connection.release();
        }
    });
};

module.exports = DBPool;
