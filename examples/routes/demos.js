var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/parser', function(req, res) {
  res.render('demos/parser', { title: 'GOLL-E Parser Demo' });
});

module.exports = router;
