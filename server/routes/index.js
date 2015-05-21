var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'GOLL-E demo server' });
});

router.get('/layoutTesting', function(req, res) {
  res.render('layoutTesting.html');
});


module.exports = router;
