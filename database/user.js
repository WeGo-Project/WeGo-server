var DBPool = require('./dbpool.js');
var Define = require('./define.js');

var KeyDefine = new Define;
KeyDefine.TABLE_NAME = 'users';

var CurrentDB = {}
CurrentDB.login = function(query, callback) {
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
            result.data = {id: rows[0].id, name: rows[0].name}
            callback(result);
        });
    });
}

CurrentDB.register = function(query, callback) {
    DBPool.getConnection(function(err, connection) {
        var result = {request: KeyDefine.ACTION_REMOVE, target: KeyDefine.TABLE_NAME, result: KeyDefine.RESULT_FAILED}
        if (err) {
            console.error('Error in getting connection: ' + err.code);
            callback(result);
            return;
        }

        if (!(query.id && query.name && query.gender && query.birthday)) {
            callback(result);
            return;
        }

        var queryOption = {
            sql: 'insert into ?? (id, name, gender, birthday, credit) value (?, ?, ?, ?, ?)',
            values: [KeyDefine.TABLE_NAME, query.id, query.name, query.gender, query.birthday, KeyDefine.USER_INIT_CREDIT],
            timeout: 10000
        };


        connection.query(queryOption, function(err, rows) {
            if (err) {
                console.error('Error in inserting %s: ' + err.code, KeyDefine.TABLE_NAME);
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

CurrentDB.chguname = function(query, callback) {
    DBPool.getConnection(function(err, connection) {
        var result = {request: KeyDefine.ACTION_UPDATE, target: KeyDefine.TABLE_NAME, result: KeyDefine.RESULT_FAILED}
        if (err) {
            console.error('Error in getting connection: ' + err.code);
            callback(result);
            return;
        }

        var queryOption;
        if (!(query.id && query.name)) {
            callback(result);
            return;
        } else {
            queryOption = {
                sql: 'update ?? set name = ? where id = ?',
                values: [KeyDefine.TABLE_NAME, query.name, query.id],
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

module.exports = CurrentDB;
