var express = require('express');
var router = express.Router();

var EventEmitter = require("events").EventEmitter

/* New values posted */
router.get('/:sid', function(req, res) {

	console.log("Slave " + req.params.sid + " connecting");

	// let request last as long as possible
	req.socket.setTimeout(Infinity);

	// creates the envent callback to contact the slave
	slave = new EventEmitter();

	slave.on('newOrientation', function(orientation) {
		res.write("data:" + JSON.stringify(orientation));
		res.write('\n\n');
		console.log("slave " + req.params.sid + " will receive: " + orientation);
	});

	req.app.locals.slave[req.params.sid] = slave;



	// ask to keep this stream open
	res.writeHead(200, {
		'Content-Type': 'text/event-stream',
		'Cache-Control': 'no-cache',
		'Connection': 'keep-alive'
	});
	res.write('\n');



	// remove this listener form the map
	req.on("close", function() {
		req.app.locals.slave[req.params.sid].removeAllListeners();
		delete req.app.locals.slave[req.params.sid];
	});


	console.log("Slave " + req.params.sid + " connected");

});

module.exports = router;
