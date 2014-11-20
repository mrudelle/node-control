var express = require('express');
var router = express.Router();
var indexPage = "index.html";

/* GET home page. */
router.get('/', function(req, res) {

	var options = {
		root: __dirname + '/..' ,
		dotfiles: 'deny',
		headers: {
			'x-timestamp': Date.now(),
			'x-sent': true
		}
	};

	res.sendFile(indexPage, options, function (err) {
		if (err) {
			console.log(err);
			res.status(err.status).end();
		} else {
			console.log('Sent:', indexPage);
		}
	});

});

module.exports = router;
