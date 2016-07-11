var DBPool = require('./dbpool.js');
var Define = require('./define.js');

var KeyDefine = new Define;
KeyDefine.TABLE_NAME = 'notice';
KeyDefine.PARAM_LACK_QUERY_PARAM = '1';
KeyDefine.RESULT_QUERY_FAILED = '2';
KeyDefine.RESULT_QUERY_EMPTY = '3';
KeyDefine.RESULT_ADD_FAILED = '4';
KeyDefine.PARAM_DUP_ENTRY = '5';
KeyDefine.PARAM_WRONG_TYPE_FOR_COLUMNS = '6';
KeyDefine.RESULT_NOT_REFERENCED_ROW = '7';
KeyDefine.RESULT_DELETE_NULL_AFFECT = '8';
KeyDefine.RESULT_UPDATE_NULL_AFFECT = '9';
KeyDefine.NOTICE_STATUS_UNREAD = '1';
KeyDefine.NOTICE_STATUS_READ = '2';
KeyDefine.NOTICE_CONTENT_TIME = '100';

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
        if (query.user_id && query.exercise_id && query.notice_content && query.time) {
            queryOption = {
                sql: 'INSERT INTO ?? (user_id, exercise_id, notice_content, time, status) VALUE (?, ?, ?, ?, ?)',
                values: [KeyDefine.TABLE_NAME, query.user_id, query.exercise_id, query.notice_content, query.time, KeyDefine.NOTICE_STATUS_UNREAD],
                timeout: 10000
            }
        } else if (!query.user_id || !query.exercise_id || !query.notice_content || !query.time) {
            console.error('Error in getting add params');
            result.result = KeyDefine.PARAM_LACK_QUERY_PARAM;
            callback(result);
            return;
        } else {
            callback(result);
            return;
        }

        connection.query(queryOption, function(err, rows) {
            if (err) {
                console.error('Error in adding %s: ' + err.code, KeyDefine.TABLE_NAME);
                callback(result);
                return;
            } else if (rows.affectedRows === 0) {
                console.error('Failed in adding user notice');
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
        if (query.user_id) {
            queryOption = {
                sql: 'SELECT exercise.id FROM exercise, notice WHERE exercise.sponsor_id = ? AND exercise.start_time > ? AND exercise.start_time < ? AND (NOT (notice.user_id = ? AND notice.exercise_id = exercise.id AND notice.notice_content = ?))',
                values: [query.user_id, new Date(), new Date(+new Date() + 3600000), query.user_id, KeyDefine.NOTICE_CONTENT_TIME],
                timeout: 10000
            }
            connection.query(queryOption, function(err, rows1) {
                console.log('rows1: ');
                console.log(rows1);
                if (err) {
                    console.error('Error in query exercise & notice: ' + err.code);
                    callback(result);
                    return;
                } else if (rows1.length > 0) {
                    var count = 0;
                    for (var index in rows1) {
                        var add_query = {
                            user_id: query.user_id,
                            exercise_id: rows1[index].id,
                            notice_content: KeyDefine.NOTICE_CONTENT_TIME,
                            time: new Date(),
                            status: KeyDefine.NOTICE_STATUS_UNREAD
                        };
                        CurrentDB.add(add_query, function(result) {
                            if (result.result !== KeyDefine.RESULT_SUCCESS) {
                                console.error('Error in adding time notice for exercise_id: ' + rows1[index].id);
                            }
                            count++;
                            if (count === rows1.length) {
                                queryOption = {
                                    sql: 'SELECT exercise.id FROM exercise, attendency, notice WHERE attendency.user_id = ? AND attendency.exercise_id = exercise.id AND exercise.start_time > ? AND exercise.start_time < ? AND (NOT (notice.user_id = ? AND notice.exercise_id = exercise.id AND notice.notice_content = ?))',
                                    values: [query.user_id, new Date(), new Date(+new Date() + 3600000), query.user_id, KeyDefine.NOTICE_CONTENT_TIME],
                                    timeout: 10000
                                };
                                connection.query(queryOption, function(err, rows2) {
                                    console.log('rows2: ');
                                    console.log(rows2);
                                    if (err) {
                                        console.error(err);
                                        console.error('Error in query exercise & attendency & notice: ' + err.code);
                                        callback(result);
                                        return;
                                    } else if (rows2.length > 0) {
                                        var count = 0;
                                        for (var index in rows2) {
                                            var add_query = {
                                                user_id: query.user_id,
                                                exercise_id: rows2[index],
                                                notice_content: KeyDefine.NOTICE_CONTENT_TIME,
                                                time: new Date(),
                                                status: KeyDefine.NOTICE_STATUS_UNREAD
                                            };
                                            CurrentDB.add(add_query, function(result) {
                                                if (result.result !== KeyDefine.RESULT_SUCCESS) {
                                                    console.error('Error in adding time notice for exercise_id: ' + rows2[index]);
                                                }
                                                count++;
                                                if (count === rows2.length) {
                                                    queryOption = {
                                                        sql: 'SELECT * FROM ?? WHERE user_id = ?',
                                                        values: [KeyDefine.TABLE_NAME, query.user_id],
                                                        timeout: 10000
                                                    };
                                                    connection.query(queryOption, function(err, rows3) {
                                                        console.log('rows3: ');
                                                        console.log(rows3);
                                                        if (err) {
                                                            console.error('Error in querying %s: ' + err.code, KeyDefine.TABLE_NAME);
                                                            callback(result);
                                                            return;
                                                        } else if (rows3.length <= 0) {
                                                            result.result = KeyDefine.RESULT_QUERY_EMPTY;
                                                            callback(result);
                                                            return;
                                                        }

                                                        result.result = KeyDefine.RESULT_SUCCESS;
                                                        result.data = rows3;
                                                        callback(result);
                                                    });
                                                }
                                            });
                                        }
                                    }
                                });
                            }
                        });
                    }
                }
            });
        } else if (!query.user_id) {
            console.error('Error in query param: user_id');
            result.result = KeyDefine.PARAM_LACK_QUERY_PARAM;
            callback(result);
            return;
        } else {
            callback(result);
            return;
        }
    });
}
CurrentDB.read = function(query, callback) {
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
        if (query.notice_id) {
            queryOption = {
                sql: 'UPDATE ?? SET status = ? WHERE id = ?',
                values: [KeyDefine.TABLE_NAME, KeyDefine.NOTICE_STATUS_READ, query.notice_id],
                timeout: 10000
            }
        } else if (!query.notice_id) {
            console.error('Error in getting empty param: notice_id');
            result.result = KeyDefine.PARAM_LACK_QUERY_PARAM;
            callback(result);
            return;
        } else {
            callback(result);
            return;
        }

        connection.query(queryOption, function(err, rows) {
            if (err) {
                console.error('Error in updating %s: ' + err.code, KeyDefine.TABLE_NAME);
                callback(result);
                return;
            } else if (rows.affectedRows !== 0) {
                result.result = KeyDefine.RESULT_SUCCESS;
                callback(result);
            } else {
                result.result = KeyDefine.RESULT_UPDATE_NULL_AFFECT;
                callback(result);
                return;
            }
        });
    });
}

module.exports = CurrentDB;
