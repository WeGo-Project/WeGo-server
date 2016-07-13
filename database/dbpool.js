var mysql = require('mysql')

mysqlPool = mysql.createPool({
    database: 'wego',
    user: 'root',
    password: 'root'
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
