var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var Define = require('../database/define.js');
var fs = require('fs');
var KeyDefine = new Define;

var fileFinishedDirectory = './image/finished/';
var fileTempDirectory = './image/tmp/';

// 以下中间件用于用户登录验证和鉴权
router.use(function(req, res, next) {
    //TODO: 验证与鉴权代码代码
    next();
});

router.get('/upload', function (req, res) {
    console.log('requested to save file: ' + req.query.filename);
    var result = { request: 'upload', target: 'image'};
    fs.exists(fileFinishedDirectory + req.query.filename, function (exists) {
      if (exists) {
        result.result = KeyDefine.RESULT_FAILED;
        console.log('file already exists: ' + req.query.filename);
      } else {
        result.result = KeyDefine.RESULT_SUCCESS;
        console.log('file not found, sending able to accept file: ' + req.query.filename);
      }
      result.data = req.query.filename;
      res.json(result);
    });
});

router.post('/upload', function (req, res) {
    var form = new formidable.IncomingForm();
    form.uploadDir = fileTempDirectory;

    form.parse(req, function(error, fields, files) {
      var result = { request: 'upload', target: 'file'};
      if (error) {
          result.result = KeyDefine.RESULT_FAILED;
          console.log(error.toString());
          res.json(result);
          return;
      }

      var targetFilePath = fileFinishedDirectory + files.file.name;
      console.log(files.file.path);
      console.log(targetFilePath);
      fs.rename(files.file.path, targetFilePath, function (error) {
          if (error) {
              result.result = KeyDefine.RESULT_FAILED;
              console.log(error.toString());
              res.json(result);
              return;
          }
          result.result = KeyDefine.RESULT_SUCCESS;
          result.data = files.file.name;
          console.log("Saved file: " + result.data);
          res.json(result);
      });
    });
});

router.post('/download', function (req, res) {
    console.log('requested to send file: ' + req.body.filename);
    var filename = req.body.filename;

    fs.exists(fileFinishedDirectory + req.body.filename, function (exists) {
      if (exists) {
          var sendOptions = { root: fileFinishedDirectory };
          res.sendFile(filename, sendOptions, function (error) {
            if (error) {
              console.log('send file error: ' + error);
              try {
                res.sendStatus(400);
              } catch (error) {
                console.log("error in send file: " + error.toString());
              }
            }
          });
      } else {
          res.sendStatus(404);
          console.log('file not found: ' + filename);
      }
    });
});

module.exports = router;
