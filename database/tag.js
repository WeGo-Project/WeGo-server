var DBPool = require('./dbpool.js');
var Define = require('./define.js');

var KeyDefine = new Define;
KeyDefine.TABLE_NAME = 'tag';
KeyDefine.RESULT_LACK_QUERY_PARAM = '1';
KeyDefine.RESULT_QUERY_FAILED = '2';
KeyDefine.RESULT_QUERY_EMPTY = '3';

var CurrentDB = {}
CurrentDB.query = function(query, callback) {
    DBPool.getConnection(function(err, connection) {
        var result = {
                request: KeyDefine.ACTION_QUERY,
                target: KeyDefine.TABLE_NAME,
                result: KeyDefine.RESULT_FAILED
            }
            // Connection init error
        if (err) {
            console.error('Error in getting connection: ' + err.code);
            callback(result);
            return;
        }

        var queryOption;
        if (query.tag_id) {
            queryOption = {
                sql: 'SELECT * FROM ?? WHERE id = ?',
                values: [KeyDefine.TABLE_NAME, query.tag_id],
                timeout: 10000
            }
        } else {
            // query params error
            result.result = KeyDefine.RESULT_LACK_QUERY_PARAM;
            callback(result);
            return;
        }

        connection.query(queryOption, function(err, rows) {
            if (err) {
                // query failed error
                console.error('Error in querying %s: ' + err.code, KeyDefine.TABLE_NAME);
                result.result = KeyDefine.RESULT_QUERY_FAILED;
                callback(result);
                return;
            } else if (rows.length <= 0) {
                console.log('Error in query tag_id: ' + query.tag_id);
                result.result = KeyDefine.RESULT_QUERY_EMPTY;
                callback(result);
                return;
            }

            result.result = KeyDefine.RESULT_SUCCESS;
            result.data = {
                tag_id: rows[0].id,
                name: rows[0].name
            };
            callback(result);
        });
    });
}

module.exports = CurrentDB;
