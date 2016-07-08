var express = require('express');
var router = express.Router();
var targetDB = require('../database/user.js');

router.get('/query', function (req, res) {
    targetDB.query(req.query, function(result) {
        res.json(result);
    });
});

router.get('/remove', function(req, res) {
    targetDB.remove(req.query, function(result) {
        res.json(result);
    });
});

router.get('/update', function (req, res) {
    targetDB.update(req.query, function(result) {
        res.json(result);
    });
});

router.get('/insert', function (req, res) {
    targetDB.insert(req.query, function(result) {
        res.json(result);
    });
});

module.exports = router;
