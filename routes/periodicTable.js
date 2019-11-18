const express = require('express');

var router = express.Router();

router.get('/', function(req,res){
	// TODO: Authentication for users either from database or passphrase
	res.render('periodicTable', {
		"precursors" : [],
		"points" : [
			['0.25', '0.25', '0.50'], 
			['0.333', '0.167', '0.50'], 
			['0.40', '0.60', '0.00']],
		"diagram" : []
	});
});

module.exports = router;
