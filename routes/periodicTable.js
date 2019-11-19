const express = require('express');

var router = express.Router();

router.get('/', function(req,res){
	// TODO: Authentication for users either from database or passphrase
	res.render('periodicTable', {
		precursors: [
			{Name: "Li2S"},
			{Name: "Al2S3"},
			{Name: "Al2O3"},
			{Name: "LiAlO2"},
			{Name: "Li2O"},
			{Name: "SnS2"},
			{Name: "LiCl"}
		]
	});
});

module.exports = router;
