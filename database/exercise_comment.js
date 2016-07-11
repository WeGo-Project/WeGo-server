/**
 * Created by var on 2016/7/10.
 */
var DBPool = require('./dbpool.js');
var Define = require('./define.js');
//
//var commentDB = require('./exercise_comment.js');


var KeyDefine = new Define;
KeyDefine.TABLE_NAME = 'exercise_comments';
KeyDefine.PARAM_LACK_QUERY_PARAM = '1';
KeyDefine.RESULT_QUERY_FAILED = '2';
KeyDefine.RESULT_QUERY_EMPTY = '3';
KeyDefine.RESULT_ADD_FAILED = '4';
KeyDefine.PARAM_DUP_ENTRY = '5';
KeyDefine.PARAM_WRONG_TYPE_FOR_COLUMNS = '6';
KeyDefine.RESULT_NOT_REFERENCED_ROW = '7';
KeyDefine.RESULT_DELETE_NULL_AFFECT = '8';

var CurrentDB = {}
CurrentDB.addcomment = function(query, callback) {
    DBPool.getConnection(function(err, connection) {
        var result = {
            request: KeyDefine.ACTION_INSERT,
            target: KeyDefine.TABLE_NAME,
            result: KeyDefine.RESULT_FAILED
        }
        //console.log(result);

        if (err) {
            console.error('Error in getting connection: ' + err.code);
            callback(result);
            return;
        }
        //console.log(result);

        var queryOption;
        if (query.exercise_id && query.user_id && query.comment && query.grade && query.time) {
            queryOption = {
                sql: 'INSERT INTO ?? (exercise_id, user_id, commnet, grade, time) VALUES (?, ?, ?, ?, ?)',
                values: [KeyDefine.TABLE_NAME, query.exercise_id, query.user_id, query.commnet, query.grade, new Date()],
                timeout: 10000
            }
        } else
            {
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

CurrentDB.query_comment = function(query, callback) {
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
                sql: 'SELECT * FROM ?? WHERE exercise_id = ?',
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
            } else {
                result.result = KeyDefine.RESULT_SUCCESS;
                result.data = rows;
                callback(result);
            }
        });
    });
}

module.exports = CurrentDB;