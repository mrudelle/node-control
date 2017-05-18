var express = require('express');
var router = express.Router();

/* Return an unused session ID */
router.get('/', function(req, res) {

	// create a random session ID with alphanumeric values
	function generator()
	{
		var range = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
		var sid = '';
		var length = 6;

		// it's faster to type only letters from a mobile
		if (req.app.get('env') === 'development') 
		{
			range = 'BCDEFGHIJKLMNOPQRSTUVWXYZ'
			length = 4
		}

		for(var i = 0; i < length; i++)
			sid += range.charAt(Math.random()*range.length);

		return sid;
	}

	var sid = generator();

	while(req.app.locals.slave[sid] != null)
		sid = generator();

	console.log(req.headers.host)

	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

	res.status(200);
	res.end(sid);

});

module.exports = router;
