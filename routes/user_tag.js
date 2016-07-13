var express = require('express');
var router = express.Router();
var targetDB = require('../database/user_tag.js');

// 以下中间件用于用户登录验证和鉴权
router.use(function(req, res, next) {
    //TODO: 验证与鉴权代码代码
    next();
});

router.post('/add_user_tag', function(req, res) {
    targetDB.add(req.body, function(result) {
        res.json(result);
    });
});

router.post('/update_user_tag', function(req, res) {
    targetDB.update(req.body, function(result) {
        res.json(result);
    });
});

router.post('/add_user_new_tag', function(req, res) {

});

router.post('/del_tag', function(req, res) {
    targetDB.delete(req.body, function(result) {
        res.json(result);
    });
});

router.post('/query_usr_tag', function(req, res) {
    targetDB.query(req.body, function(result) {
        res.json(result);
    });
});

module.exports = router;
