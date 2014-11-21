var express = require('express');
var router = express.Router();

/* New values posted */
router.post('/:sid', function(req, res) {
	
	
	//trigger a new orientation event to this session
	target = req.app.locals.slave[req.params.sid]
	if (target != null)
	{
		target.emit("newOrientation", req.body);
	}
	else
	{
		console.log("No listener with SID:" + req.params.sid);
	}

	res.end('It worked');
});

module.exports = router;
