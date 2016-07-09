var express = require('express');
var router = express.Router();
var targetDB = require('../database/user_tag.js');

router.post('/add_user_tag', function(req, res) {
    targetDB.add(req.body, function(result) {
        res.json(result);
    });
});

router.post('/add_user_new_tag', function(req, res) {

});

router.post('/del_usr_tag', function(req, res) {
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
