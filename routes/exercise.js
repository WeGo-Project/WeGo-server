var express = require('express');
var router = express.Router();
var targetDB = require('../database/exercise.js');

// 以下中间件用于用户登录验证和鉴权
router.use(function(req, res, next) {
    //TODO: 验证与鉴权代码代码
    next();
});

// 时间转换中间件
router.use(function(req, res, next) {
    if (req.body.start_time) {
        req.body.start_time = new Date(req.body.start_time);
    }
    if (req.body.end_time) {
        req.body.end_time = new Date(req.body.end_time);
    }
    next();
});

router.post('/add_exercise', function (req, res) {
    targetDB.add_exercise(req.body, function(result) {
        res.json(result);
    });
});

router.post('/chg_start_time', function (req, res) {
    targetDB.chg_start_time(req.body, function(result) {
        res.json(result);
    });
});

router.post('/chg_end_time', function (req, res) {
    targetDB.chg_end_time(req.body, function(result) {
        res.json(result);
    });
});

router.post('/chg_name', function (req, res) {
    targetDB.chg_name(req.body, function(result) {
        res.json(result);
    });
});

router.post('/chg_location', function (req, res) {
    targetDB.chg_location(req.body, function(result) {
        res.json(result);
    });
});

router.post('/chg_status', function (req, res) {
    targetDB.chg_status(req.body, function(result) {
        res.json(result);
    });
});

router.post('/query_nearby_exercise', function (req, res) {
    targetDB.query_nearby_exercise(req.body, function(result) {
        res.json(result);
    });
});

router.post('/query_nearby_tag_exercise', function (req, res) {
    targetDB.query_nearby_tag_exercise(req.body, function(result) {
        res.json(result);
    });
});

router.post('/query_user_exercise', function (req, res) {
    targetDB.query_user_exercise(req.body, function(result) {
        res.json(result);
    });
});

router.post('/query_user_current_exercise', function (req, res) {
    targetDB.query_user_current_exercise(req.body, function(result) {
        res.json(result);
    });
});

module.exports = router;
