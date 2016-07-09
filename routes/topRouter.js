var express = require('express');
var router = express.Router();

var formidable = require('formidable');
var fs = require('fs');

router.get('/user', function(req, res) {
    res.render('user.jade');
});

var user = require('./user.js');
router.use('/user', user);

router.get('/attendency', function(req, res) {
    res.render('attendency.jade');
});

var attendency = require('./attendency.js');
router.use('/attendency', attendency);

module.exports = router;
