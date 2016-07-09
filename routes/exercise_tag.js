var express = require('express');
var router = express.Router();
var targetDB = require('../database/exercise_tag.js');

router.post('/add_exer_tag', function(req, res) {
    targetDB.add(req.body, function(result) {
        res.json(result);
    });
});

router.post('/add_exer_new_tag', function(req, res) {

});

router.post('/del_tag', function(req, res) {
    targetDB.delete(req.body, function(result) {
        res.json(result);
    });
});

router.post('/query_exer_tag', function(req, res) {
    targetDB.query(req.body, function(result) {
        res.json(result);
    });
});

module.exports = router;
