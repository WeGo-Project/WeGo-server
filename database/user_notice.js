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
KeyDefine.NOTICE_CONTENT_COMMENT = '200';

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
        if (query.user_id && query.exercise_id && query.notice_content) {
            queryOption = {
                sql: 'INSERT INTO ?? (user_id, exercise_id, notice_content, time, status) VALUE (?, ?, ?, ?, ?)',
                values: [KeyDefine.TABLE_NAME, query.user_id, query.exercise_id, query.notice_content, new Date(), KeyDefine.NOTICE_STATUS_UNREAD],
                timeout: 10000
            }
        } else if (!query.user_id || !query.exercise_id || !query.notice_content) {
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
CurrentDB.add_sponsor_notice = function(query, callback) {
    KeyDefine.CURRENT_FUNC = 'add_sponsor_notice';
    DBPool.getConnection(function(err, connection) {
        var result = {
            request: KeyDefine.ACTION_INSERT,
            target: KeyDefine.TABLE_NAME,
            result: KeyDefine.RESULT_FAILED
        }
        if (err) {
            console.error('Error in getting connection in %s %s: ' + err.code, KeyDefine.TABLE_NAME, KeyDefine.CURRENT_FUNC);
            callback(result);
            return;
        }
        var queryOption;
        if (query.user_id) {
            queryOption = {
                sql: 'SELECT id FROM exercise WHERE sponsor_id = ? AND start_time > ? AND start_time < ?',
                values: [query.user_id, new Date(), new Date(+new Date() + 3600000)],
                timeout: 10000
            };
            connection.query(queryOption, function(err, rows1) {
                if (err) {
                    console.error('Error in query exercise by sponsor_id: ' + err.code);
                    callback(result);
                    return;
                } else if (rows1.length > 0) {
                    var count = 0;
                    for (var index in rows1) {
                        queryOption = {
                            sql: 'SELECT id FROM ?? WHERE user_id = ? AND exercise_id = ? AND notice_content = ?',
                            values: [KeyDefine.TABLE_NAME, query.user_id, rows1[index].id, KeyDefine.NOTICE_CONTENT_TIME],
                            timeout: 10000
                        };
                        connection.query(queryOption, function(err, rows2) {
                            if (err) {
                                console.error('Error in query notice by user_id & exercise_id & notice_content: err.code');
                                callback(result);
                                return;
                            } else if (rows2.length === 0) {
                                var add_query = {
                                    user_id: query.user_id,
                                    exercise_id: rows1[index].id,
                                    notice_content: KeyDefine.NOTICE_CONTENT_TIME
                                };
                                CurrentDB.add(add_query, function(result) {
                                    if (result.result !== KeyDefine.RESULT_SUCCESS) {
                                        console.error('Error in adding time notice for exercise_id: ' + rows1[index].id);
                                    }
                                    count++;
                                    if (count === rows1.length) {
                                        result.result = KeyDefine.RESULT_SUCCESS;
                                        callback(result);
                                    }
                                });
                            } else {
                                count++;
                                if (count === rows1.length) {
                                    result.result = KeyDefine.RESULT_SUCCESS;
                                    callback(result);
                                }
                            }
                        });
                    }
                } else {
                    result.result = KeyDefine.RESULT_SUCCESS;
                    callback(result);
                }
            });
        } else if (!query.user_id) {
            console.error('Error in getting query params: user_id in %s', KeyDefine.CURRENT_FUNC);
            result.result = KeyDefine.PARAM_LACK_QUERY_PARAM;
            callback(result);
            return;
        } else {
            callback(result);
            return;
        }
    });
}
CurrentDB.add_partner_notice = function(query, callback) {
    KeyDefine.CURRENT_FUNC = 'add_partner_notice';
    DBPool.getConnection(function(err, connection) {
        var result = {
            request: KeyDefine.ACTION_INSERT,
            target: KeyDefine.TABLE_NAME,
            result: KeyDefine.RESULT_FAILED
        }
        if (err) {
            console.error('Error in getting connection in %s %s: ' + err.code, KeyDefine.TABLE_NAME, KeyDefine.CURRENT_FUNC);
            callback(result);
            return;
        }
        var queryOption;
        if (query.user_id) {
            queryOption = {
                sql: 'SELECT exercise.id FROM exercise, attendency WHERE attendency.user_id = ? AND attendency.exercise_id = exercise.id AND exercise.start_time > ? AND exercise.start_time < ?',
                values: [query.user_id, new Date(), new Date(+new Date() + 3600000)],
                timeout: 10000
            };
            connection.query(queryOption, function(err, rows1) {
                if (err) {
                    console.error('Error in query exercise & attendency by user_id & start_time: ' + err.code);
                    callback(result);
                    return;
                } else if (rows1.length > 0) {
                    var count = 0;
                    for (var index in rows1) {
                        queryOption = {
                            sql: 'SELECT id FROM ?? WHERE user_id = ? AND exercise_id = ? AND notice_content = ?',
                            values: [KeyDefine.TABLE_NAME, query.user_id, rows1[index].id, KeyDefine.NOTICE_CONTENT_TIME],
                            timeout: 10000
                        };
                        connection.query(queryOption, function(err, rows2) {
                            if (err) {
                                console.error('Error in query notice by user_id & exercise_id & notice_content: err.code');
                                callback(result);
                                return;
                            } else if (rows2.length === 0) {
                                var add_query = {
                                    user_id: query.user_id,
                                    exercise_id: rows1[index].id,
                                    notice_content: KeyDefine.NOTICE_CONTENT_TIME
                                };
                                CurrentDB.add(add_query, function(result) {
                                    if (result.result !== KeyDefine.RESULT_SUCCESS) {
                                        console.error('Error in adding time notice for exercise_id: ' + rows1[index].id);
                                    }
                                    count++;
                                    if (count === rows1.length) {
                                        result.result = KeyDefine.RESULT_SUCCESS;
                                        callback(result);
                                    }
                                });
                            } else {
                                count++;
                                if (count === rows1.length) {
                                    result.result = KeyDefine.RESULT_SUCCESS;
                                    callback(result);
                                }
                            }
                        });
                    }
                } else {
                    result.result = KeyDefine.RESULT_SUCCESS;
                    callback(result);
                }
            });
        } else if (!query.user_id) {
            console.error('Error in getting query params: user_id in %s', KeyDefine.CURRENT_FUNC);
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
                sql: 'SELECT * FROM ?? WHERE user_id = ?',
                values: [KeyDefine.TABLE_NAME, query.user_id],
                timeout: 10000
            }
            connection.query(queryOption, function(err, rows) {
                if (err) {
                    console.error('Error in query notice by user_id: ' + err.code);
                    callback(result);
                    return;
                } else if (rows.length > 0) {
                    result.result = KeyDefine.RESULT_SUCCESS;
                    result.data = rows;
                    callback(result);
                } else {
                    result.result = KeyDefine.RESULT_QUERY_EMPTY;
                    callback(result);
                    return;
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
