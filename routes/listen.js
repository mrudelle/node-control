var express = require('express');
var router = express.Router();

/* New values posted */
router.post('/', function(req, res) {

	//the thing here will be to never close a response 
	// but I gess it is not good for node to have many streams open

	console.log("Slave connecting");

	res.end('It worked');
});

module.exports = router;
