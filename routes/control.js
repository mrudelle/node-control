var express = require('express');
var router = express.Router();

/* New values posted */
router.post('/:sid', function(req, res) {
	

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

	res.end('It worked');
});

module.exports = router;
