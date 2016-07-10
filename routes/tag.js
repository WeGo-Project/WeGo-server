var express = require('express');
var router = express.Router();
var targetDB = require('../database/tag.js');

// 以下中间件用于用户登录验证和鉴权
router.use(function(req, res, next) {
    //TODO: 验证与鉴权代码代码
    next();
});

router.post('/query_all_tag', function(req, res) {
    targetDB.query_all(req.body, function(result) {
        res.json(result);
    });
});

module.exports = router;
