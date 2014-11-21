var express = require('express');
var router = express.Router();

/* New values posted */
router.post('/', function(req, res) {
	console.log(req.body);

	res.end('It worked');
});

module.exports = router;
