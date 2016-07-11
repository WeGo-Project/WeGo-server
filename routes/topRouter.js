var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({
    extended: false
}));

// 以下中间件用于用户登录验证和鉴权
var userDB = require('../database/user.js');
var Define = require('../database/define.js');
router.use(function(req, res, next) {
    var query = {
        id: req.body.open_id
    }
    userDB.login(query, function(result) {
        if (result.result === Define.RESULT_SUCCESS) {
            req.body.login_status = define.USER_LONGIN;
        } else {
            req.body.login_status = define.USER_NOT_LONGIN;
        }
    });
    next();
});

var formidable = require('formidable');

router.get('/user', function(req, res) {
    res.render('user.jade');
});
router.get('/exercise', function(req, res) {
    res.render('exercise.jade');
});
router.get('/notice', function(req, res) {
    res.render('notice.jade');
});

var user = require('./user.js');
router.use('/user', user);
var exercise = require('./exercise.js');
router.use('/exercise', exercise);

router.get('/attendency', function(req, res) {
    res.render('attendency.jade');
});

var attendency = require('./attendency.js');
router.use('/attendency', attendency);

var tag = require('./tag.js');
router.use('/tag', tag);

var exercise_tag = require('./exercise_tag.js');
router.use('/exercise_tag', exercise_tag);

var user_tag = require('./user_tag.js');
router.use('/user_tag', user_tag);

var user_notice = require('./user_notice.js');
router.use('/user_notice', user_notice);

module.exports = router;
