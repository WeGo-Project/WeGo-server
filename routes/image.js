var express = require('express');
var router = express.Router();
var targetDB = require('../database/image.js');
var formidable = require('formidable');

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
        result.result = 'failed';
        console.log('file already exists: ' + req.query.filename);
      } else {
        result.result = 'success';
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
          result.result = 'error: ' + error.toString();
          console.log(error.toString());
          res.json(result);
          return;
      }

      var targetFilePath = fileFinishedDirectory + files.file.name;
      fs.rename(files.file.path, targetFilePath, function (error) {
          if (error) {
              result.result = 'failed';
              console.log(error.toString());
              res.json(result);
              return;
          } else {
              result.result = 'success';
              console.log("Saved file: " + result.data);
          }

          result.data = files.file.name;
          res.json(result);
      });
    });
});

router.post('/download', function (req, res) {
    console.log('requested to send file: ' + req.query.filename);
    var filename = req.query.filename;

    fs.exists(fileFinishedDirectory + req.query.filename, function (exists) {
      if (exists) {
          var sendOptions = { root: fileFinishedDirectory };
          res.sendFile(filename, sendOptions, function (error) {
            if (error) {
              console.log('send file error: ' + error);
              try {
                res.sendStatus(404);
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
