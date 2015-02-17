var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/parser', function(req, res) {
  res.render('demos/parser/index', { title: 'GOLL-E Parser Demo' });
});

module.exports = router;
