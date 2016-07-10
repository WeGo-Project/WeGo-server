var DBPool = require('./dbpool.js');
var Define = require('./define.js');

var KeyDefine = new Define;
KeyDefine.TABLE_NAME = 'exercise';
KeyDefine.NEW_EXERCISE_STATUS = '0';

var CurrentDB = {}
CurrentDB.add_exercise = function(query, callback) {
    DBPool.getConnection(function(err, connection) {
        var result = {request: KeyDefine.ACTION_QUERY, target: KeyDefine.TABLE_NAME, result: KeyDefine.RESULT_FAILED}
        if (err) {
            console.error('Error in getting connection: ' + err.code);
            callback(result);
            return;
        }

        var queryOption;
        if (query.latitude && query.longitude && query.sponsor_id &&
              query.start_time && query.end_time && query.description && query.name) {
            queryOption = {
                sql: 'insert into ?? (latitude, longitude, sponsor_id, start_time,\
                    end_time, description, name, created_datetime, status) values\
                    (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                values: [KeyDefine.TABLE_NAME, query.latitude, query.longitude, query.sponsor_id,
                      query.start_time, query.end_time, query.description, query.name,
                      new Date(), KeyDefine.NEW_EXERCISE_STATUS],
                timeout: 10000
            }
        } else {
            callback(result);
            return;
        }

        connection.query(queryOption, function(err, rows) {
            if (err) {
                console.error('Error in inserting %s: ' + err.code, KeyDefine.TABLE_NAME);
                callback(result);
                return;
            } else if (rows.length <= 0) {
                callback(result);
                return;
            }

            result.result = KeyDefine.RESULT_SUCCESS;
            //result.data = {id: rows[0].id, name: rows[0].name}
            callback(result);
        });
    });
}

CurrentDB.chg_start_time = function(query, callback) {
    DBPool.getConnection(function(err, connection) {
        var result = {request: KeyDefine.ACTION_REMOVE, target: KeyDefine.TABLE_NAME, result: KeyDefine.RESULT_FAILED}
        if (err) {
            console.error('Error in getting connection: ' + err.code);
            callback(result);
            return;
        }

        if (!(query.id && query.start_time)) {
            callback(result);
            return;
        }

        var queryOption = {
            sql: 'update ?? set start_time = ? where id = ?',
            values: [KeyDefine.TABLE_NAME, query.start_time, query.id],
            timeout: 10000
        };

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

CurrentDB.chg_end_time = function(query, callback) {
    DBPool.getConnection(function(err, connection) {
        var result = {request: KeyDefine.ACTION_REMOVE, target: KeyDefine.TABLE_NAME, result: KeyDefine.RESULT_FAILED}
        if (err) {
            console.error('Error in getting connection: ' + err.code);
            callback(result);
            return;
        }

        if (!(query.id && query.end_time)) {
            callback(result);
            return;
        }

        var queryOption = {
            sql: 'update ?? set end_time = ? where id = ?',
            values: [KeyDefine.TABLE_NAME, query.end_time, query.id],
            timeout: 10000
        };

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

CurrentDB.chg_name = function(query, callback) {
    DBPool.getConnection(function(err, connection) {
        var result = {request: KeyDefine.ACTION_REMOVE, target: KeyDefine.TABLE_NAME, result: KeyDefine.RESULT_FAILED}
        if (err) {
            console.error('Error in getting connection: ' + err.code);
            callback(result);
            return;
        }

        if (!(query.id && query.name)) {
            callback(result);
            return;
        }

        var queryOption = {
            sql: 'update ?? set name = ? where id = ?',
            values: [KeyDefine.TABLE_NAME, query.name, query.id],
            timeout: 10000
        };

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

CurrentDB.chg_location = function(query, callback) {
    DBPool.getConnection(function(err, connection) {
        var result = {request: KeyDefine.ACTION_REMOVE, target: KeyDefine.TABLE_NAME, result: KeyDefine.RESULT_FAILED}
        if (err) {
            console.error('Error in getting connection: ' + err.code);
            callback(result);
            return;
        }

        if (!(query.id && query.latitude && query.longitude)) {
            callback(result);
            return;
        }

        var queryOption = {
            sql: 'update ?? set latitude = ?, longitude = ? where id = ?',
            values: [KeyDefine.TABLE_NAME, query.latitude, query.longitude, query.id],
            timeout: 10000
        };

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

CurrentDB.chg_status = function(query, callback) {
    DBPool.getConnection(function(err, connection) {
        var result = {request: KeyDefine.ACTION_REMOVE, target: KeyDefine.TABLE_NAME, result: KeyDefine.RESULT_FAILED}
        if (err) {
            console.error('Error in getting connection: ' + err.code);
            callback(result);
            return;
        }

        if (!(query.id && query.status)) {
            callback(result);
            return;
        }

        var queryOption = {
            sql: 'update ?? set status = ? where id = ?',
            values: [KeyDefine.TABLE_NAME, query.status, query.id],
            timeout: 10000
        };

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

CurrentDB.query_nearby_exercise = function(query, callback) {
    DBPool.getConnection(function(err, connection) {
        var result = {request: KeyDefine.ACTION_REMOVE, target: KeyDefine.TABLE_NAME, result: KeyDefine.RESULT_FAILED}
        if (err) {
            console.error('Error in getting connection: ' + err.code);
            callback(result);
            return;
        }

        if (!(query.latitude_lower_bound && query.latitude_upper_bound &&
              query.longitude_lower_bound && query.longitude_upper_bound)) {
            callback(result);
            return;
        }

        var queryOption = {
            sql: 'select * from ?? where latitude >= ? and latitude <= ? \
              and longitude >= ? and longitude <= ?',
            values: [KeyDefine.TABLE_NAME, query.latitude_lower_bound, query.latitude_upper_bound,
              query.longitude_lower_bound, query.longitude_upper_bound],
            timeout: 10000
        };

        connection.query(queryOption, function(err, rows) {
            if (err) {
                console.error('Error in updating %s: ' + err.code, KeyDefine.TABLE_NAME);
                callback(result);
                return;
            }

            result.result = KeyDefine.RESULT_SUCCESS;
            result.data = rows;
            callback(result);
        });
    });
}

CurrentDB.query_nearby_tag_exercise = function(query, callback) {
    DBPool.getConnection(function(err, connection) {
        var result = {request: KeyDefine.ACTION_REMOVE, target: KeyDefine.TABLE_NAME, result: KeyDefine.RESULT_FAILED}
        if (err) {
            console.error('Error in getting connection: ' + err.code);
            callback(result);
            return;
        }

        if (!(query.latitude_lower_bound && query.latitude_upper_bound &&
              query.longitude_lower_bound && query.longitude_upper_bound && query.tag)) {
            callback(result);
            return;
        }

        var queryOption = {
            sql: 'select exercise.* from exercise, tag where exercise.latitude >= ? and exercise.latitude <= ? \
              and exercise.longitude >= ? and exercise.longitude <= ? and tag.id = ?',
            values: [query.latitude_lower_bound, query.latitude_upper_bound,
              query.longitude_lower_bound, query.longitude_upper_bound, query.tag],
            timeout: 10000
        };

        connection.query(queryOption, function(err, rows) {
            if (err) {
                console.error('Error in updating %s: ' + err.code, KeyDefine.TABLE_NAME);
                callback(result);
                return;
            }

            result.result = KeyDefine.RESULT_SUCCESS;
            result.data = rows;
            callback(result);
        });
    });
}

CurrentDB.query_user_exercise = function(query, callback) {
    DBPool.getConnection(function(err, connection) {
        var result = {request: KeyDefine.ACTION_REMOVE, target: KeyDefine.TABLE_NAME, result: KeyDefine.RESULT_FAILED}
        if (err) {
            console.error('Error in getting connection: ' + err.code);
            callback(result);
            return;
        }

        if (!query.sponsor_id) {
            callback(result);
            return;
        }

        var queryOption = {
            sql: 'select * from ?? where sponsor_id = ?',
            values: [KeyDefine.TABLE_NAME, query.sponsor_id],
            timeout: 10000
        };

        connection.query(queryOption, function(err, rows) {
            if (err) {
                console.error('Error in selecting %s: ' + err.code, KeyDefine.TABLE_NAME);
                callback(result);
                return;
            }

            result.result = KeyDefine.RESULT_SUCCESS;
            result.data = rows;
            callback(result);
        });
    });
}

CurrentDB.query_user_current_exercise = function(query, callback) {
    DBPool.getConnection(function(err, connection) {
        var result = {request: KeyDefine.ACTION_REMOVE, target: KeyDefine.TABLE_NAME, result: KeyDefine.RESULT_FAILED}
        if (err) {
            console.error('Error in getting connection: ' + err.code);
            callback(result);
            return;
        }

        if (!(query.sponsor_id && query.time_lower_bound && query.time_upper_bound)) {
            callback(result);
            return;
        }

        var queryOption = {
            sql: 'select * from ?? where sponsor_id = ? \
              and start_time >= ? and start_time <= ?',
            values: [KeyDefine.TABLE_NAME, query.sponsor_id, query.time_lower_bound, query.time_upper_bound],
            timeout: 10000
        };

        connection.query(queryOption, function(err, rows) {
            if (err) {
                console.error('Error in selecting %s: ' + err.code, KeyDefine.TABLE_NAME);
                callback(result);
                return;
            }

            result.result = KeyDefine.RESULT_SUCCESS;
            result.data = rows;
            callback(result);
        });
    });
}

module.exports = CurrentDB;
