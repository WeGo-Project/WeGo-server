var express = require('express');
var router = express.Router();
var targetDB = require('../database/user.js');

router.use(function(req, res, next) {
    console.log(req);
    next();
});

router.post('/login', function (req, res) {
    targetDB.query(req.body, function(result) {
        res.json(result);
    });
});

router.post('/register', function (req, res) {
    targetDB.remove(req.body, function(result) {
        res.json(result);
    });
});

router.post('/chguname', function (req, res) {
    targetDB.update(req.body, function(result) {
        res.json(result);
    });
});

router.post('/chgpwd', function (req, res) {
    targetDB.insert(req.body, function(result) {
        res.json(result);
    });
});

module.exports = router;
