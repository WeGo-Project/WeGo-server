var express = require('express');
var router = express.Router();

var formidable = require('formidable');
var fs = require('fs');

router.get('/user', function(req, res) {
    res.render('user.jade');
});

var user = require('./user.js');
router.use('/user', user);

var exercise_tag = require('./exercise_tag.js');
router.use('/exercise_tag', exercise_tag);

var user_tag = require('./user_tag.js');
router.use('/user_tag', user_tag);

module.exports = router;
