/* 
 * TODO: Fix vulernable exec string formation, we need to check all elements of the array are valid elements or you can execute
 * any console command via "& <new command> &" in the search string
 *
 * Use of the exec function should be disabled untill this fix is in place
 */
const express = require('express');
const exec = require('child_process').exec;
const path = require('path');
const MongoClient = require('mongodb').MongoClient;
const fs = require('fs');
const glob = require("glob")
const csv = require('csvtojson')
const uuidv4 = require('uuid/v4');

var router = express.Router();

const url = 'mongodb://localhost:32768';

exeDir = path.resolve(__dirname, "..", "executables/")

const VALID_ELEMENTS = [
	"H","He","Li","Be","B","C","N","O","F","Ne","Na","Mg","Al","Si","P","S","Cl","Ar",
	"K","Ca","Sc","Ti","V","Cr","Mn","Fe","Co","Ni","Cu","Zn","Ga","Ge","As","Se","Br","Kr",
	"Rb","Sr","Y","Zr","Nb","Mo","Tc","Ru","Rh","Pd","Ag","Cd","In","Sn","Sb","Te","I","Xe",
	"Cs","Ba","La","Hf","Ta","W","Re","Os","Ir","Pt","Au","Hg","Tl","Pb","Bi","Po","At","Rn",
	"Fr","Ra","Ac","Rf","Db","Sg","Bh","Hs","Mt","Ds","Rg","Cn","Nh","Fl","Mc","Lv","Ts","Og",
	"La","Ce","Pr","Nd","Pm","Sm","Eu","Gd","Tb","Dy","Ho","Er","Tm","Yb","Lu",
	"Ac","Th","Pa","U","Np","Pu","Am","Cm","Bk","Cf","Es","Fm","Md","No","Lr"
]

/*
router.get('/calc/pre/:elements/:precursor', function(req, res){
	// get the list of elements from the request
	var elements = req.params.elements.split("-");
	console.log(elements);

	exec('matsys.exe --stoichs="Li:Al:S:O" --precursors="Li#2:S Al#2:S#3 Al#2:O#3 Li:Al:O#2 Li#2:O" --margin=0.003 --samples=1000 --mode=1', {
		cwd: exeDir
	}, function(error, stdout, stderr) {
		glob(path.join(exeDir, "*.csv"), {}, (err, files) => {
			for (var file in files) {
				var fileName =  path.basename(files[file], path.extname(files[file]));
				var firstChar = fileName.charAt(0);
				var notFirstChar = fileName.substring(1,999);

				if (firstChar == '1') {
					csv().fromFile(files[file]).then((jsonObj)=>{
						client.connect(function(err) {
							collection = client.db('precursor').collection(notFirstChar);
							collection.insertMany(jsonObj, function(err, doc) {});
							client.close();
						});

						fs.unlink(files[file], function (err) {
							if (err) throw err;
							// if no error, file has been deleted successfully
							console.log('File deleted!');
						});
					});
				}
			}

			// to avoid hanging the browser
			res.render('periodicTable', {"precursors": ["LiAlO2"], "points":["0.333"]});
		});
	});
});
*/

router.get('/calc/stoich/:elements', function(req, res){
	// get the list of elements from the request
	var elements = req.params.elements.split("-");

	// build the execution string to be called in EXEC 
	var execString = './a.out --stoichs=';
	for (var i = 0; i < (elements.length - 1); i++) {
		if (VALID_ELEMENTS.includes(elements[i])) {
			execString = execString + elements[i] + ":"
		}
	}
	if (VALID_ELEMENTS.includes(elements[elements.length - 1])) {
		execString = execString + elements[elements.length - 1]
	}

	execString = execString + ' --margin=0.05 --samples=1000 --mode=0'
	var jobID = uuidv4();

	var collectionToUse = "";

	// Create promise so we can run code with a guarantee this finished first
	var execPromise = new Promise(function(resolve, reject) {
		console.log(jobID + " RUNNING:  " + execString);

		// Run the subprocess
		exec(execString, {
			cwd: exeDir
		}, function(error, stdout, stderr) {
			if (error)
				reject(err);

			// Maybe put this in a log file instead of cluttering the console
			console.log(stdout.toString());

			// Grab the CSV created with a regex like expression
			glob(path.join(exeDir, "*.csv"), {}, (err, files) => {
				if (err)
					reject(err);

				for (var file in files) {
					// Check the first char matches the mode of the calc, and extract the database table name from it
					var fileName =  path.basename(files[file], path.extname(files[file]));
					var firstChar = fileName.charAt(0);
					collectionToUse = fileName.substring(1,999);

					if (firstChar == '0') {
						// CSV to JSON
						csv().fromFile(files[file]).then((jsonObj)=>{
							// Convert all numberic strings to their float equiv so the DB gets the right datatype
							Object.keys(jsonObj).forEach(function(key) {
								Object.keys(jsonObj[key]).forEach(function(subKey) {
									if (subKey != "Key" && subKey != "Name") {
										(jsonObj[key])[subKey] = parseFloat((jsonObj[key])[subKey]); 
									}
								});
							});

							// Connect to DB and insert new points
							MongoClient.connect(url, function(err, db) {
								if (err)
									reject(err)

								var dbo = db.db("stoich");
								dbo.collection(collectionToUse).insertMany(jsonObj, function(err, doc) {
									db.close();

									// Delete file now its been used
									fs.unlink(files[file], function (err) {
										if (err) 
											reject(err);
										// if no error, file has been deleted successfully
										console.log('File deleted');

										// release promise so the program can continue 
										resolve(collectionToUse);
									});
								});
							}); 
						});
					}
				}
			});
		});
	});

	execPromise.then(function(result) {
		var collectionName = result;
		console.log(jobID + " FINISHED");

		// Connect to DB and extract points with good scores, sorted by score
		MongoClient.connect(url, function(err, db) {
			var dbo = db.db("stoich");
			var query = {};
			var sorter = {Score : 1};
			var filter = {projection: {Key: 1, Name: 1, Mass: 1}};
			dbo.collection(collectionToUse).find(query, filter).sort(sorter).limit(5).toArray(function(err, result) {
				console.log(result);

				/*var pugData = [Object.keys(result[0])];

				Object.keys(result).forEach(function(key) {
					var row = [];

					Object.keys(result[key]).forEach(function(subKey) {
						row.push((result[key])[subKey]); 
					});

					pugData.push(row);
				});

				console.log(pugData);*/

				res.render("periodicTable", {precursors: result});
				db.close();
			});
		}); 
	}, function(err) {
		console.log(err);
		res.render("error", {text: "Calculator failed to run, please wait and try again."})
	});
});

module.exports = router;
