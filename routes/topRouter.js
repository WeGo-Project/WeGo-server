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

module.exports = router;
