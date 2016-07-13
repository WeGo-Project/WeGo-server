var DBPool = require('./dbpool.js');
var Define = require('./define.js');
var tagDB = require('./tag.js');

var i, len, count;

var KeyDefine = new Define;
KeyDefine.TABLE_NAME = 'exercise_tag';
KeyDefine.PARAM_LACK_QUERY_PARAM = '9001';
KeyDefine.RESULT_QUERY_FAILED = '9002';
KeyDefine.RESULT_QUERY_EMPTY = '9003';
KeyDefine.RESULT_ADD_FAILED = '9004';
KeyDefine.PARAM_DUP_ENTRY = '9005';
KeyDefine.PARAM_WRONG_TYPE_FOR_COLUMNS = '9006';
KeyDefine.RESULT_NOT_REFERENCED_ROW = '9007';
KeyDefine.RESULT_DELETE_NULL_AFFECT = '9008';

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
        if (query.exercise_id && query.tags_id) {
            var tags = query.tags_id.split('[')[1].split(']')[0].split(',');
            count = 0;
            for (index in tags) {
                queryOption = {
                    sql: 'INSERT INTO ?? VALUES (?, ?)',
                    values: [KeyDefine.TABLE_NAME, tags[index], query.exercise_id],
                    timeout: 10000
                }
                connection.query(queryOption, function(err, rows) {
                    if (err) {
                        if (err.code === 'ER_DUP_ENTRY') {
                            console.error('Error in adding %s: ' + err.code, KeyDefine.TABLE_NAME);
                            result.result = KeyDefine.PARAM_DUP_ENTRY;
                            callback(result);
                            return;
                        } else if (err.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD') {
                            console.error('Error in adding %s: ' + err.code, KeyDefine.TABLE_NAME);
                            result.result = KeyDefine.PARAM_WRONG_TYPE_FOR_COLUMNS;
                            callback(result);
                            return;
                        } else if (err.code === 'ER_NO_REFERENCED_ROW_2') {
                            console.error('Error in adding %s: ' + err.code, KeyDefine.TABLE_NAME);
                            result.result = KeyDefine.RESULT_NOT_REFERENCED_ROW;
                            callback(result);
                            return;
                        } else {
                            console.error('Error in inserting %s: ' + err.code, KeyDefine.TABLE_NAME);
                            callback(result);
                            return;
                        }
                    } else if (rows.length <= 0) {
                        console.error('Failed in add exercise tag');
                        result.result = KeyDefine.RESULT_ADD_FAILED;
                        callback(result);
                        return;
                    }
                    count++;
                    if (count === tags.length) {
                        result.result = KeyDefine.RESULT_SUCCESS;
                        callback(result);
                    }
                });
            }
        } else if (!query.exercise_id) {
            console.error('Error in add param: exercise_id');
            result.result = KeyDefine.PARAM_LACK_QUERY_PARAM;
            callback(result);
            return;
        } else if (!query.tags_id) {
            console.error('Error in add param: tags_id');
            result.result = KeyDefine.PARAM_LACK_QUERY_PARAM;
            callback(result);
            return;
        } else {
            callback(result);
            return;
        }
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
        if (query.exercise_id) {
            queryOption = {
                sql: 'SELECT tag_id FROM ?? WHERE exercise_id = ?',
                values: [KeyDefine.TABLE_NAME, query.exercise_id],
                timeout: 10000
            }
        } else if (!query.exercise_id) {
            console.error('Error in query param: exercise_id');
            result.result = KeyDefine.PARAM_LACK_QUERY_PARAM;
            callback(result);
            return;
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
                result.result = KeyDefine.RESULT_QUERY_EMPTY;
                callback(result);
                return;
            }

            result.data = new Array();
            count = 0;
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
                            console.log('Empty in query exercise tag');
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
        if (query.tag_id && query.exercise_id) {
            queryOption = {
                sql: 'DELETE FROM ?? WHERE tag_id = ? AND exercise_id = ?',
                values: [KeyDefine.TABLE_NAME, query.tag_id, query.exercise_id],
                timeout: 10000
            }
        } else if (!query.tag_id) {
            console.error('Error in getting delete param named tag_id');
            result.result = KeyDefine.PARAM_LACK_QUERY_PARAM;
            callback(result);
            return;
        } else if (!query.exercise_id) {
            console.error('Error in getting delete param named exercise_id');
            result.result = KeyDefine.PARAM_LACK_QUERY_PARAM;
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
            } else if (rows.affectedRows !== 0) {
                result.result = KeyDefine.RESULT_SUCCESS;
                callback(result);
            } else {
                console.error('Failed to delete in ' + KeyDefine.TABLE_NAME + '. Null rows affected.');
                result.result = KeyDefine.RESULT_DELETE_NULL_AFFECT;
                callback(result);
                return;
            }
        });
    });
}

module.exports = CurrentDB;
