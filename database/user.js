var DBPool = require('./dbpool.js');
var Define = require('./define.js');

var KeyDefine = new Define;
KeyDefine.TABLE_NAME = 'user';

KeyDefine.query = function(query, callback) {
    DBPool.getConnection(function(err, connection) {
        var result = {request: KeyDefine.ACTION_QUERY, target: KeyDefine.TABLE_NAME, result: KeyDefine.RESULT_FAILED}
        if (err) {
            console.error('Error in getting connection: ' + err.code);
            callback(result);
            return;
        }

        var queryOption;
        if (query.id) {
            queryOption = {
                sql: 'select * from ?? where id = ?',
                values: [KeyDefine.TABLE_NAME, query.id],
                timeout: 10000
            }
        } else if (query.username && query.password){
            queryOption = {
                sql: 'select * from ?? where username = ? and password = ?',
                values: [KeyDefine.TABLE_NAME, query.username, query.password],
                timeout: 10000
            }
        } else {
            callback(result);
            return;
        }

        connection.query(queryOption, function(err, rows) {
            if (err) {
                console.error('Error in querying %s: ' + err.code, KeyDefine.TABLE_NAME);
                callback(result);
                return;
            } else if (rows.length <= 0) {
                callback(result);
                return;
            }

            result.result = KeyDefine.RESULT_SUCCESS;
            result.data = {id: rows[0].id, username: rows[0].username}
            callback(result);
        });
    });
}

KeyDefine.remove = function(query, callback) {
    DBPool.getConnection(function(err, connection) {
        var result = {request: KeyDefine.ACTION_REMOVE, target: KeyDefine.TABLE_NAME, result: KeyDefine.RESULT_FAILED}
        if (err) {
            console.error('Error in getting connection: ' + err.code);
            callback(result);
            return;
        }

        if (!query.id) {
            callback(result);
            return;
        }

        var queryOption = {
            sql: 'delete from ?? where id = ?',
            values: [KeyDefine.TABLE_NAME, query.id],
            timeout: 10000
        };


        connection.query(queryOption, function(err, rows) {
            if (err) {
                console.error('Error in deleting %s: ' + err.code, KeyDefine.TABLE_NAME);
                callback(result);
                return;
            }

            if (rows.affectedRows <= 0) {
                callback(result);
                return;
            }

            result.result = KeyDefine.RESULT_SUCCESS;
            callback(result);
        });
    });
}

KeyDefine.update = function(query, callback) {
    DBPool.getConnection(function(err, connection) {
        var result = {request: KeyDefine.ACTION_UPDATE, target: KeyDefine.TABLE_NAME, result: KeyDefine.RESULT_FAILED}
        if (err) {
            console.error('Error in getting connection: ' + err.code);
            callback(result);
            return;
        }

        var queryOption;
        if (!query.id) {
            callback(result);
            return;
        } else if (query.username) {
            queryOption = {
                sql: 'update ?? set username = ? where id = ?',
                values: [KeyDefine.TABLE_NAME, query.username, query.id],
                timeout: 10000
            };
        } else if (query.password) {
            queryOption = {
                sql: 'update ?? set password = ? where id = ?',
                values: [KeyDefine.TABLE_NAME, query.password, query.id],
                timeout: 10000
            };
        }

        connection.query(queryOption, function(err, rows) {
            if (err) {
                console.error('Error in updating %s: ' + err.code, KeyDefine.TABLE_NAME);
                callback(result);
                return;
            }
            if (rows.affectedRows <= 0) {
                callback(result);
                return;
            }

            result.result = KeyDefine.RESULT_SUCCESS;
            callback(result);
        });
    });
}

KeyDefine.insert = function(query, callback) {
    DBPool.getConnection(function(err, connection) {
        var result = {request: KeyDefine.ACTION_INSERT, target: KeyDefine.TABLE_NAME, result: KeyDefine.RESULT_FAILED}
        if (err) {
            console.error('Error in getting connection: ' + err.code);
            callback(result);
            return;
        }

        var queryOption;
        if (query.username && query.password) {
            queryOption = {
                sql: 'insert into ?? (username, password) values (?, ?)',
                values: [KeyDefine.TABLE_NAME, query.username, query.password],
                timeout: 10000
            };
        } else {
            callback(result);
            return;
        }

        connection.query(queryOption, function(err, rows) {
            if (err) {
                console.error('Error in inserting %s: ' + err.code, KeyDefine.TABLE_NAME);
                callback(result);
                return;
            }

            result.result = KeyDefine.RESULT_SUCCESS;
            result.data = {id: rows.insertId, username: query.username}
            callback(result);
        });
    });
}

module.exports = KeyDefine;
