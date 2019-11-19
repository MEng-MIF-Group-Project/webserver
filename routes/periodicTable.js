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
		],
		diagram: [
			{A:75,B:25,C:0, label:'1'},
			{A:73,B:10,C:20,label:'2'},
			{A:75,B:20,C:5, label:'3'},
			{A:5, B:60,C:35,label:'4'},
			{A:10,B:80,C:10,label:'5'},
			{A:10,B:90,C:0, label:'6'},
			{A:20,B:70,C:10,label:'7'},
			{A:10,B:20,C:70,label:'8'},
			{A:15,B:5, C:80,label:'9'},
			{A:10,B:10,C:80,label:'10'},
			{A:20,B:10,C:70,label:'11'},
		]
	});
});

module.exports = router;
