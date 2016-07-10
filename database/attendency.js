var DBPool = require('./dbpool.js');
var Define = require('./define.js');

var KeyDefine = new Define;
KeyDefine.TABLE_NAME = 'attendency';

var CurrentDB = {}

CurrentDB.addusrActi = function(req, callback)
{
    DBPool.getConnection(function(err, connection) {
        var result = {request: KeyDefine.ACTION_INSERT, target: KeyDefine.TABLE_NAME, result: KeyDefine.RESULT_SUCCESS}
        if (err)
        {
            console.error('Error in getting connection: ' + err.code);
            result.result = KeyDefine.RESULT_SERVER_FAILED;
            callback(result);
            return;
        }

        if (req.user_id && req.exercise_id && req.created_day)
        {
            var queryOption = {
                sql: 'insert into attendency (user_id, exercise_id, attend_time) value (?, ?, ?)',
                values: [req.user_id, req.exercise_id, req.created_day],
                timeout: 10000
            };

            connection.query(queryOption, function(err, rows) {
                if (err)
                {
                    console.error('Error in inserting %s: ' + err.code, KeyDefine.TABLE_NAME);
                    result.result = KeyDefine.RESULT_SERVER_FAILED;
                    callback(result);
                    return;
                }
                else if (rows.affectedRows <= 0)
                {
                    result.result = KeyDefine.RESULT_SERVER_FAILED;
                    callback(result);
                    return;
                }

                result.data = {}
                callback(result);
            });
        }
        else
        {
            result.result = KeyDefine.RESULT_FAILED;
            callback(result);
            return;
        }
    });
}

module.exports = CurrentDB;
