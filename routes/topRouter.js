var express = require('express');
var router = express.Router();

var formidable = require('formidable');
var fs = require('fs');

router.get('/user', function(req, res) {
    res.render('user.jade');
});
router.get('/exercise', function(req, res) {
    res.render('exercise.jade');
});

var user = require('./user.js');
router.use('/user', user);
var user = require('./exercise.js');
router.use('/exercise', user);

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
