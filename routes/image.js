var express = require('express');
var router = express.Router();
var targetDB = require('../database/image.js');

// 以下中间件用于用户登录验证和鉴权
router.use(function(req, res, next) {
    //TODO: 验证与鉴权代码代码
    next();
});

router.post('/upload', function (req, res) {
    targetDB.upload(req.body, function(result) {
        res.json(result);
    });
});

router.post('/download', function (req, res) {
    targetDB.download(req.body, function(result) {
        res.json(result);
    });
});

module.exports = router;
