var express = require('express');
var router = express.Router();

/* New values posted */
router.post('/:sid', function(req, res) {
	
	// Temporarily allow anyone to register TODO: select origins
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

	//trigger a new orientation event to the target session
	target = req.app.locals.slave[req.params.sid]
	if (target != null)
	{
		target.emit("newOrientation", req.body);
	}
	else
	{
		res.status(404)
		res.end('Session ID not found')
		return
	}

	res.status(200)
	res.end('It worked');
});

module.exports = router;
