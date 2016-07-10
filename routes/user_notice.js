var express = require('express');
var router = express.Router();
var targetDB = require('../database/user_notice.js');

// 以下中间件用于用户登录验证和鉴权
router.use(function(req, res, next) {
    //TODO: 验证与鉴权代码代码
    next();
});

router.post('/query_notice', function(req, res) {
    targetDB.query(req.body, function(result) {
        res.json(result);
    });
});

router.post('/read_notice', function(req, res) {
    targetDB.read(req.body, function(result) {
        res.json(result);
    });
});

router.post('/add_notice', function(req, res) {
    targetDB.add(req.body, function(result) {
        res.json(result);
    });
});

module.exports = router;
