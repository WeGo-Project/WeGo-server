var DBPool = require('./dbpool.js');
var Define = require('./define.js');
var tagDB = require('./tag.js');

var KeyDefine = new Define;
KeyDefine.TABLE_NAME = 'user_tag';
KeyDefine.RESULT_LACK_QUERY_PARAM = '1';
KeyDefine.RESULT_QUERY_FAILED = '2';
KeyDefine.RESULT_QUERY_EMPTY = '3';
KeyDefine.RESULT_ADD_FAILED = '4';
KeyDefine.RESULT_DELETE_FAILED = '5';

var CurrentDB = {}
CurrentDB.add = function(query, callback) {
    DBPool.getConnection(function(err, connection) {
        var result = {
            request: KeyDefine.ACTION_INSERT,
            target: KeyDefine.TABLE_NAME,
            result: KeyDefine.RESULT_FAILED
        }

        if (err) {
            console.error('Error in getting connection: ' + err.code);
            callback(result);
            return;
        }

        var queryOption;
        if (query.user_id && query.tag_id) {
            queryOption = {
                sql: 'INSERT INTO ?? VALUES (?, ?)',
                values: [KeyDefine.TABLE_NAME, query.tag_id, query.user_id],
                timeout: 10000
            }
        } else if (!query.user_id) {
            console.error('Error in query param: user_id');
            result.result = KeyDefine.RESULT_LACK_QUERY_PARAM;
            callback(result);
            return;
        } else if (!query.tag_id) {
            console.error('Error in query param: tag_id');
            result.result = KeyDefine.RESULT_LACK_QUERY_PARAM;
            callback(result);
            return;
        } else {
            callback(result);
            return;
        }

        connection.query(queryOption, function(err, rows) {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    console.error('Error in adding %s: ' + err.code, KeyDefine.TABLE_NAME);
                    result.result = KeyDefine.RESULT_DUP_ENTRY;
                    callback(result);
                    return;
                } else {
                    console.error('Error in inserting %s: ' + err.code, KeyDefine.TABLE_NAME);
                    callback(result);
                    return;
                }
            } else if (rows.length <= 0) {
                console.error('Failed in add user tag');
                result.result = KeyDefine.RESULT_ADD_FAILED;
                callback(result);
                return;
            }

            result.result = KeyDefine.RESULT_SUCCESS;
            callback(result);
        });
    });
}
CurrentDB.query = function(query, callback) {
    DBPool.getConnection(function(err, connection) {
        var result = {
            request: KeyDefine.ACTION_QUERY,
            target: KeyDefine.TABLE_NAME,
            result: KeyDefine.RESULT_FAILED
        }

        if (err) {
            console.error('Error in getting connection: ' + err.code);
            callback(result);
            return;
        }

        var queryOption;
        if (query.user_id) {
            queryOption = {
                sql: 'SELECT tag_id FROM ?? WHERE user_id = ?',
                values: [KeyDefine.TABLE_NAME, query.user_id],
                timeout: 10000
            }
        } else {
            result.result = KeyDefine.RESULT_LACK_QUERY_PARAM;
            callback(result);
            return;
        }

        connection.query(queryOption, function(err, rows) {
            if (err) {
                console.error('Error in querying %s: ' + err.code, KeyDefine.TABLE_NAME);
                callback(result);
                return;
            } else if (rows.length <= 0) {
                result.result = KeyDefine.RESULT_QUERY_EMPTY;
                callback(result);
                return;
            }

            result.data = new Array();
            var count = 0;
            for (var index in rows) {
                var query = {
                    tag_id: rows[index].tag_id
                };
                tagDB.query(query, function(current_result) {
                    if (current_result.result === KeyDefine.RESULT_SUCCESS) {
                        result.data.push(current_result.data);
                    }
                    count++;
                    if (count == rows.length) {
                        if (result.data.length <= 0) {
                            console.log('Empty in query user tag');
                            result.result = KeyDefine.RESULT_QUERY_EMPTY;
                            callback(result);
                            return;
                        } else {
                            result.result = KeyDefine.RESULT_SUCCESS;
                            callback(result);
                        }
                    }
                });
            }
        });
    });
}
CurrentDB.delete = function(query, callback) {
    DBPool.getConnection(function(err, connection) {
        var result = {
            request: KeyDefine.ACTION_REMOVE,
            target: KeyDefine.TABLE_NAME,
            result: KeyDefine.RESULT_FAILED
        }

        if (err) {
            console.error('Error in getting connection: ' + err.code);
            callback(result);
            return;
        }

        var queryOption;
        if (query.tag_id && query.user_id) {
            queryOption = {
                sql: 'DELETE FROM ?? WHERE tag_id = ? AND user_id = ?',
                values: [KeyDefine.TABLE_NAME, query.tag_id, query.user_id],
                timeout: 10000
            }
        } else if (!query.tag_id) {
            console.error('Error in getting query param named tag_id');
            result.result = KeyDefine.RESULT_LACK_QUERY_PARAM;
            callback(result);
            return;
        } else if (!query.user_id) {
            console.error('Error in getting query param named user_id');
            result.result = KeyDefine.RESULT_LACK_QUERY_PARAM;
            callback(result);
            return;
        } else {
            callback(result);
            return;
        }

        connection.query(queryOption, function(err, rows) {
            if (err) {
                console.error('Error in delete %s: ' + err.code, KeyDefine.TABLE_NAME);
                callback(result);
                return;
            } else if (rows.length <= 0) {
                console.error('Failed in delete in ' + KeyDefine.TABLE_NAME);
                result.result = KeyDefine.RESULT_DELETE_FAILED;
                callback(result);
                return;
            }

            result.result = KeyDefine.RESULT_SUCCESS;
            callback(result);
        });
    });
}

module.exports = CurrentDB;
