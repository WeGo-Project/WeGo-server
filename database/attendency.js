var DBPool = require('./dbpool.js');
var Define = require('./define.js');
var noticeDB = require('./user_notice.js');

var KeyDefine = new Define;
KeyDefine.TABLE_NAME = 'attendency';
KeyDefine.NOTICE_CONTENT_JOIN_ACTI = '300';
KeyDefine.NOTICE_CONTENT_EXIT_ACTI = '400';
KeyDefine.ACTIVITY_OUTLINE = '1000';

var CurrentDB = {};
CurrentDB.addusrActi = function(req, callback) {
    DBPool.getConnection(function(err, connection) {
        var result = {
            request: KeyDefine.ACTION_INSERT,
            target: KeyDefine.TABLE_NAME,
            result: KeyDefine.RESULT_SUCCESS
        };
        if (err) {
            console.error('Error in getting connection: ' + err.code);
            result.result = KeyDefine.RESULT_SERVER_FAILED;
            callback(result);
            return;
        }

        if (req.user_id && req.activity_id && req.phone && req.nickname) {
            var queryOption = {
                sql: 'SELECT deadline, sponsor_id FROM exercise WHERE id = ?',
                values: [req.activity_id],
                timeout: 10000
            };
            connection.query(queryOption, function(err, rows1) {
                if (err) {
                    console.error('Error in querying exercise by exercise_id: ' + err.code);
                    result.result = KeyDefine.RESULT_SERVER_FAILED;
                    callback(result);
                    return;
                } else if (rows1.length <= 0) {
                    console.error('Empty in querying exercise');
                    result.result = KeyDefine.RESULT_SERVER_FAILED;
                    callback(result);
                    return;
                } else {
                    if (rows1[0].deadline > new Date()) {
                        queryOption = {
                            sql: 'insert into attendency (user_id, exercise_id, attend_time, nickname, phone) value (?, ?, ?, ?, ?)',
                            values: [req.user_id, req.activity_id, new Date(), req.nickname, req.phone],
                            timeout: 10000
                        };
                        connection.query(queryOption, function(err, rows2) {
                            if (err) {
                                console.error('Error in inserting %s: ' + err.code, KeyDefine.TABLE_NAME);
                                result.result = KeyDefine.RESULT_SERVER_FAILED;
                                callback(result);
                                return;
                            } else if (rows2.affectedRows <= 0) {
                                result.result = KeyDefine.RESULT_SERVER_FAILED;
                                callback(result);
                                return;
                            }
                            var notice_content;
                            queryOption = {
                                sql: 'SELECT name FROM users WHERE id = ?',
                                values: [req.user_id],
                                timeout: 10000
                            };
                            connection.query(queryOption, function(err, rows3) {
                                if (err || rows3.length <= 0) {
                                    notice_content = '有新用户参与活动';
                                } else {
                                    notice_content = '用户: ' + rows3[0].name + '参与活动';
                                }
                                queryOption = {
                                    sql: 'SELECT name FROM exercise WHERE id = ?',
                                    values: [req.activity_id],
                                    timeout: 10000
                                };
                                connection.query(queryOption, function(err, rows4) {
                                    if (err || rows4.length <= 0) {
                                        notice_content += '';
                                    } else {
                                        notice_content += ': ' + rows4[0].name;
                                    }
                                    var notice_param = {
                                        user_id: rows1[0].sponsor_id,
                                        exercise_id: req.activity_id,
                                        notice_content: notice_content
                                    };
                                    noticeDB.add(notice_param, function(result2) {
                                        if (result2.result === KeyDefine.RESULT_SUCCESS) {
                                            callback(result);
                                        } else {
                                            result.result = KeyDefine.RESULT_FAILED;
                                            callback(result);
                                            return;
                                        }
                                    });
                                })
                            });
                        });
                    } else {
                        console.error('Error: Deadline of exercise: %s is outline', req.activity_id);
                        result.result = KeyDefine.ACTIVITY_OUTLINE;
                        callback(result);
                        return;
                    }
                }
            });
        } else {
            result.result = KeyDefine.RESULT_FAILED;
            callback(result);
            return;
        }
    });
};

CurrentDB.delusrActi = function(req, callback) {
    DBPool.getConnection(function(err, connection) {
        var result = {
            request: KeyDefine.ACTION_REMOVE,
            target: KeyDefine.TABLE_NAME,
            result: KeyDefine.RESULT_SUCCESS
        };
        if (err) {
            console.error('Error in getting connection: ' + err.code);
            result.result = KeyDefine.RESULT_SERVER_FAILED;
            callback(result);
            return;
        }

        if (req.user_id && req.activity_id) {
            var queryOption = {
                sql: 'delete from attendency where user_id=? and exercise_id=?',
                values: [req.user_id, req.activity_id],
                timeout: 10000
            };

            connection.query(queryOption, function(err, rows) {
                if (err) {
                    console.error('Error in deleting %s: ' + err.code, KeyDefine.TABLE_NAME);
                    result.result = KeyDefine.RESULT_SERVER_FAILED;
                    callback(result);
                    return;
                } else if (rows.affectedRows <= 0) {
                    result.result = '未找到记录';
                    callback(result);
                    return;
                } else {
                    queryOption = {
                        sql: 'SELECT sponsor_id FROM exercise WHERE id = ?',
                        values: [req.activity_id],
                        timeout: 10000
                    };
                    connection.query(queryOption, function(err, rows1) {
                        if (err) {
                            console.error('Error in querying exercise by id: ' + err.code);
                            result.result = KeyDefine.RESULT_SERVER_FAILED;
                            callback(result);
                            return;
                        } else if (rows.length <= 0) {
                            console.error('Empty in querying exercise by id');
                            result.result = KeyDefine.RESULT_SERVER_FAILED;
                            callback(result);
                            return;
                        } else {
                            var notice_content;
                            queryOption = {
                                sql: 'SELECT name FROM users WHERE id = ?',
                                values: [req.user_id],
                                timeout: 10000
                            };
                            connection.query(queryOption, function(err, rows3) {
                                if (err || rows3.length <= 0) {
                                    notice_content = '有用户退出活动';
                                } else {
                                    notice_content = '用户: ' + rows3[0].name + '退出活动';
                                }
                                queryOption = {
                                    sql: 'SELECT name FROM exercise WHERE id = ?',
                                    values: [req.activity_id],
                                    timeout: 10000
                                };
                                connection.query(queryOption, function(err, rows4) {
                                    if (err || rows4.length <= 0) {
                                        notice_content += '';
                                    } else {
                                        notice_content += ': ' + rows4[0].name;
                                    }
                                    var notice_param = {
                                        user_id: rows1[0].sponsor_id,
                                        exercise_id: req.activity_id,
                                        notice_content: notice_content
                                    };
                                    noticeDB.add(notice_param, function(result2) {
                                        if (result2.result === KeyDefine.RESULT_SUCCESS) {
                                            callback(result);
                                        } else {
                                            result.result = KeyDefine.RESULT_FAILED;
                                            callback(result);
                                            return;
                                        }
                                    });
                                })
                            });
                        }
                    });
                }
            });
        } else {
            result.result = KeyDefine.RESULT_FAILED;
            callback(result);
            return;
        }
    });
};

CurrentDB.query_usrforActi = function(req, callback) {
    DBPool.getConnection(function(err, connection) {
        var result = {
            request: KeyDefine.ACTION_QUERY,
            target: KeyDefine.TABLE_NAME,
            result: KeyDefine.RESULT_SUCCESS
        };
        if (err) {
            console.error('Error in getting connection: ' + err.code);
            result.result = KeyDefine.RESULT_SERVER_FAILED;
            callback(result);
            return;
        }

        if (req.activity_id) {
            var queryOption = {
                sql: 'select * from attendency,users where attendency.exercise_id=? and attendency.user_id=users.id',
                values: [req.activity_id],
                timeout: 10000
            };

            connection.query(queryOption, function(err, rows) {
                if (err) {
                    console.error('Error in querying %s: ' + err.code, KeyDefine.TABLE_NAME);
                    result.result = err.code;
                    callback(result);
                    return;
                } else if (rows.length <= 0) {
                    result.result = '未找到记录';
                    callback(result);
                    return;
                }

                result.data = [];
                for (var i = 0; i < rows.length; i++) {
                    var it = {
                        name: rows[i].name,
                        birthday: rows[i].birthday,
                        gender: rows[i].gender,
                        credit: rows[i].credit,
                        attendTime: rows[i].attend_time,
                        exercise_id: rows[i].exercise_id,
                        nickname: rows[i].nickname,
                        phone: rows[i].phone
                    };
                    result.data.push(it);
                }
                callback(result);
            });
        } else {
            result.result = KeyDefine.RESULT_FAILED;
            callback(result);
            return;
        }
    });
};

CurrentDB.query_actiforusr = function(req, callback) {
    DBPool.getConnection(function(err, connection) {
        var result = {
            request: KeyDefine.ACTION_QUERY,
            target: KeyDefine.TABLE_NAME,
            result: KeyDefine.RESULT_SUCCESS
        };
        if (err) {
            console.error('Error in getting connection: ' + err.code);
            result.result = KeyDefine.RESULT_SERVER_FAILED;
            callback(result);
            return;
        }

        if (req.user_id && req.activity_id) {
            var queryOption = {
                sql: 'select * from attendency where user_id=? and exercise_id=?',
                values: [req.user_id, req.activity_id],
                timeout: 10000
            };

            connection.query(queryOption, function(err, rows) {
                if (err) {
                    console.error('Error in querying %s: ' + err.code, KeyDefine.TABLE_NAME);
                    result.result = err.code;
                    callback(result);
                    return;
                } else if (rows.length <= 0) {
                    result.result = '未找到记录';
                    callback(result);
                    return;
                }

                result.data = [];
                var it = {
                    user_id: rows[0].user_id,
                    exercise_id: rows[0].exercise_id,
                    attendTime: rows[0].attend_time,
                    nickname: rows[0].nickname,
                    phone: rows[0].phone
                };
                result.data.push(it);
                callback(result);
            });
        } else {
            result.result = KeyDefine.RESULT_FAILED;
            callback(result);
            return;
        }
    });
};

CurrentDB.query_allforusr = function(req, callback) {
    DBPool.getConnection(function(err, connection) {
        var result = {
            request: KeyDefine.ACTION_QUERY,
            target: KeyDefine.TABLE_NAME,
            result: KeyDefine.RESULT_SUCCESS
        };
        if (err) {
            console.error('Error in getting connection: ' + err.code);
            result.result = KeyDefine.RESULT_SERVER_FAILED;
            callback(result);
            return;
        }

        if (req.user_id) {
            var queryOption = {
                sql: 'select * from attendency,exercise where attendency.exercise_id=exercise.id and attendency.user_id=?',
                values: [req.user_id],
                timeout: 10000
            };

            connection.query(queryOption, function(err, rows) {
                if (err) {
                    console.error('Error in querying %s: ' + err.code, KeyDefine.TABLE_NAME);
                    result.result = err.code;
                    callback(result);
                    return;
                } else if (rows.length <= 0) {
                    result.result = '未找到记录';
                    callback(result);
                    return;
                }

                result.data = [];
                for (var i = 0; i < rows.length; i++) {
                    var it = {
                        id: rows[i].id,
                        exName: rows[i].name,
                        attendTime: rows[i].attend_time,
                        latitude: rows[i].latitude,
                        longitude: rows[i].longitude,
                        sponsor_id: rows[i].sponsor_id,
                        startTime: rows[i].start_time,
                        endTime: rows[i].end_time,
                        descrip: rows[i].description,
                        created_datetime: rows[i].created_datetime,
                        status: rows[i].status,
                        minNum: rows[i].min_num,
                        maxNum: rows[i].max_num,
                        nickname: rows[i].nickname,
                        phone: rows[i].phone
                    };
                    result.data.push(it);
                }
                callback(result);
            });
        } else {
            result.result = KeyDefine.RESULT_FAILED;
            callback(result);
            return;
        }
    });
};

CurrentDB.query_actibytime = function(req, callback) {
    DBPool.getConnection(function(err, connection) {
        var result = {
            request: KeyDefine.ACTION_QUERY,
            target: KeyDefine.TABLE_NAME,
            result: KeyDefine.RESULT_SUCCESS
        };
        if (err) {
            console.error('Error in getting connection: ' + err.code);
            result.result = KeyDefine.RESULT_SERVER_FAILED;
            callback(result);
            return;
        }

        if (req.user_id && req.time_lower_bound && req.time_upper_bound) {
            var queryOption = {
                sql: 'select * from attendency,exercise where attendency.exercise_id=exercise.id and attendency.user_id=? and exercise.start_time>=? and exercise.end_time<=?',
                values: [req.user_id, req.time_lower_bound, req.time_upper_bound],
                timeout: 10000
            };

            connection.query(queryOption, function(err, rows) {
                if (err) {
                    console.error('Error in querying %s: ' + err.code, KeyDefine.TABLE_NAME);
                    result.result = err.code;
                    callback(result);
                    return;
                } else if (rows.length <= 0) {
                    result.result = '未找到记录';
                    callback(result);
                    return;
                }

                result.data = [];
                for (var i = 0; i < rows.length; i++) {
                    var it = {
                        id: rows[i].id,
                        exName: rows[i].name,
                        attendTime: rows[i].attend_time,
                        latitude: rows[i].latitude,
                        longitude: rows[i].longitude,
                        sponsor_id: rows[i].sponsor_id,
                        startTime: rows[i].start_time,
                        endTime: rows[i].end_time,
                        descrip: rows[i].description,
                        created_datetime: rows[i].created_datetime,
                        status: rows[i].status,
                        minNum: rows[i].min_num,
                        maxNum: rows[i].max_num,
                        nickname: rows[i].nickname,
                        phone: rows[i].phone
                    };
                    result.data.push(it);
                }
                callback(result);
            });
        } else {
            result.result = KeyDefine.RESULT_FAILED;
            callback(result);
            return;
        }
    });
};

CurrentDB.query_actibeforeend = function(req, callback) {
    DBPool.getConnection(function(err, connection) {
        var result = {
            request: KeyDefine.ACTION_QUERY,
            target: KeyDefine.TABLE_NAME,
            result: KeyDefine.RESULT_SUCCESS
        };
        if (err) {
            console.error('Error in getting connection: ' + err.code);
            result.result = KeyDefine.RESULT_SERVER_FAILED;
            callback(result);
            return;
        }

        if (req.user_id) {
            var queryOption = {
                sql: 'select * from attendency,exercise where attendency.exercise_id=exercise.id and attendency.user_id=? and (exercise.status=0 or exercise.status=1)',
                values: [req.user_id],
                timeout: 10000
            };

            connection.query(queryOption, function(err, rows) {
                if (err) {
                    console.error('Error in querying %s: ' + err.code, KeyDefine.TABLE_NAME);
                    result.result = err.code;
                    callback(result);
                    return;
                } else if (rows.length <= 0) {
                    result.result = '未找到记录';
                    callback(result);
                    return;
                }

                result.data = [];
                for (var i = 0; i < rows.length; i++) {
                    var it = {
                        id: rows[i].id,
                        exName: rows[i].name,
                        attendTime: rows[i].attend_time,
                        latitude: rows[i].latitude,
                        longitude: rows[i].longitude,
                        sponsor_id: rows[i].sponsor_id,
                        startTime: rows[i].start_time,
                        endTime: rows[i].end_time,
                        descrip: rows[i].description,
                        created_datetime: rows[i].created_datetime,
                        status: rows[i].status,
                        minNum: rows[i].min_num,
                        maxNum: rows[i].max_num,
                        nickname: rows[i].nickname,
                        phone: rows[i].phone
                    };
                    result.data.push(it);
                }
                callback(result);
            });
        } else {
            result.result = KeyDefine.RESULT_FAILED;
            callback(result);
            return;
        }
    });
};

module.exports = CurrentDB;
