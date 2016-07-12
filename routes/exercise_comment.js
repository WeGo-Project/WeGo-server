/**
 * Created by var on 2016/7/10.
 */
var express = require('express');
var router = express.Router();
var targetDB = require('../database/exercise_comment.js');

router.use(function(req, res, next) {
    //TODO: 验证与鉴权代码代码
    next();
});
router.post('/add_comment', function(req, res) {
    targetDB.add_comment(req.body, function(result) {
        res.json(result);
    });
});

router.post('/query_comment', function(req, res) {
    targetDB.query_comment(req.body, function(result) {
        res.json(result);
    });
});
module.exports = router;
