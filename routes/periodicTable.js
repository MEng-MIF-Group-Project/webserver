const express = require('express');

var router = express.Router();

router.get('/', function(req,res){
	// TODO: Authentication for users either from database or passphrase
	res.render('periodicTable', {
		"precursors" : [
			
		],
		"points" : [
			['id', 'formula', 'mass'],
			['00', 'LiAlO2', '65.9478'], 
			['01', 'Al7O3', '236.869'], 
			['02', 'Li2Al3O2', '126.878']
		],
		"diagram" : [

		]
	});
});

module.exports = router;
