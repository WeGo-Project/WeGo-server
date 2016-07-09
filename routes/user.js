var express = require('express');
var router = express.Router();
var targetDB = require('../database/user.js');

// 以下中间件用于用户登录验证和鉴权
router.use(function(req, res, next) {
    //TODO: 验证与鉴权代码代码
    next();
});

router.post('/login', function (req, res) {
    targetDB.login(req.body, function(result) {
        res.json(result);
    });
});

router.post('/register', function (req, res) {
    targetDB.register(req.body, function(result) {
        res.json(result);
    });
});

router.post('/chguname', function (req, res) {
    targetDB.chguname(req.body, function(result) {
        res.json(result);
    });
});

router.post('/chgpwd', function (req, res) {
    targetDB.chgpwd(req.body, function(result) {
        res.json(result);
    });
});

module.exports = router;
