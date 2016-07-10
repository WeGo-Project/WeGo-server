/**
 * Created by TWDean on 2016/7/9.
 */

var express = require('express');
var router = express.Router();
var targetDB = require('../database/attendency.js');

router.use(function(req, res, next) {
    //TODO: 验证与鉴权代码代码
    next();
});

router.post('/addusrActi', function (req, res) {
    targetDB.addusrActi(req.body, function(result) {
        res.json(result);
    });
});

router.post('/delusrActi', function (req, res) {
    targetDB.delusrActi(req.body, function(result) {
        res.json(result);
    });
});

router.post('/query_usrforActi', function (req, res) {
    targetDB.query_usrforActi(req.body, function(result) {
        res.json(result);
    });
});

router.post('/query_actiforusr', function (req, res) {
    targetDB.query_actiforusr(req.body, function(result) {
        res.json(result);
    });
});

router.post('/query_allforusr', function (req, res) {
    targetDB.query_allforusr(req.body, function(result) {
        res.json(result);
    });
});

router.post('/query_actibytime', function (req, res) {
    targetDB.query_actibytime(req.body, function(result) {
        res.json(result);
    });
});

router.post('/query_actibeforeend', function (req, res) {
    targetDB.query_actibeforeend(req.body, function(result) {
        res.json(result);
    });
});

module.exports = router;
