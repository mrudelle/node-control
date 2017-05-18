var express = require('express');
var router = express.Router();

var EventEmitter = require("events").EventEmitter

/* New values posted */
router.get('/:sid', function(req, res) {

	// Temporarily allow anyone to register TODO: select origins
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');


	// send an error if this sid is already in use
	if (req.app.locals.slave[req.params.sid] != null)
	{
		res.status(409); // send a conflict error
		res.end("sid already in use, pick another");

		return;
	}

	// let request last as long as possible
	req.socket.setTimeout(0);

	// creates the envent callback to contact the slave
	slave = new EventEmitter();

	// actually send the control orders to the "slave"
	slave.on('newOrientation', function(orientation) {
		res.write("data:" + JSON.stringify(orientation));
		res.write('\n\n');
	});

	req.app.locals.slave[req.params.sid] = slave;

	/*
	ressources on server sent event:
		- http://www.html5rocks.com/en/tutorials/eventsource/basics/
		- https://github.com/tomkersten/sses-node-example/blob/master/app.js#L76
		- https://github.com/BrunoChauvet/rails-angularjs-sse/blob/93083b487d19493db98be40bf92c58fe259d811c/app/assets/javascripts/share.js

	ressources on EventEmitter:
		- http://code.tutsplus.com/tutorials/using-nodes-event-module--net-35941
	*/



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
