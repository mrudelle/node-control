var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {

	// create a random session ID with alphanumeric values
	function generator()
	{
		var range = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
		var sid = '';

		for(var i = 0; i < 6; i++)
			sid += range.charAt(Math.random()*range.length);

		return sid;
	}

	var sid = generator();

	while(req.app.locals.slave[sid] != null)
		sid = generator();

	res.status(200);
	res.end(sid);

});

module.exports = router;
