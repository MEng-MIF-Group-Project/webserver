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

// Helper function to check depth of a JSON object, used to check for single solution parses from the CSV to JSON
function getDepth(obj) {
	var depth = 0;
	if (obj.children) {
		obj.children.forEach(function (d) {
			var tmpDepth = getDepth(d)
			if (tmpDepth > depth) {
				depth = tmpDepth
			}
		})
	}
	return 1 + depth
}

router.get('/calc/pre/:quantity/:elements/:precursor', function(req, res){
	// get the list of elements, precursors, and runtime data from the request
	var elements = req.params.elements.split("-");
	var precursor = req.params.precursor.split("-");
	var quantityMargin = req.params.quantity.split("-");

	// get the quantity of points from the request
	var numPoints = parseInt(quantityMargin[0]);
	if (isNaN(numPoints)) {
		numPoints = 20;
	}

	var margin = parseFloat(quantityMargin[1]);
	if (isNaN(margin)) {
		margin = 0.003;
	}

	// Order Elements for consistency
	orderedElements = new Array(112).fill(null);
	for (var i = 0; i < (elements.length); i++) {
		var eleIndex = VALID_ELEMENTS.indexOf(elements[i].replace(/[0-9]/g,''));
		orderedElements.splice(eleIndex,1,elements[i]);
	}
	var elements = orderedElements.filter(function (el) {
		return el != null;
	});

	// build the execution string to be called in EXEC
	var execString = 'samply.exe --stoichs=\"';
	var elementList = '';
	for (var i = 0; i < (elements.length); i++) {
		if (VALID_ELEMENTS.includes(elements[i].replace(/[0-9]/g,''))) {
			elementList = elementList + elements[i];
		}
	}
	execString = execString + elementList;

	execString = execString + "\" --precursors=\"";
	for (var i = 0; i < (precursor.length - 1); i++) {
		execString = execString + precursor[i] + ' ';
	}
	execString = execString + precursor[precursor.length - 1]

	execString = execString + "\" --margin=" + margin.toString() + " --samples=1000 --mode=1";
	console.log(execString);

	var collectionToUse = "";
	var jobID = uuidv4();

	var execPromise = new Promise(function(resolve, reject) {
		exec(execString, {
			cwd: exeDir
		}, function(error, stdout, stderr) {
			if (error)
				reject(error);

			// Maybe put this in a log file instead of cluttering the console
			console.log(stdout.toString());
			if (stdout.toString().includes("No solutions")) {
				resolve(-1);
			}
			else {
				// Grab the CSV created with a regex like expression
				glob(path.join(exeDir, "*.csv"), {}, (err, files) => {
					if (err)
						reject(err);

					for (var file in files) {
						// Check the first char matches the mode of the calc, and extract the database table name from it
						var fileName =  path.basename(files[file], path.extname(files[file]));
						var firstChar = fileName.charAt(0);
						collectionToUse = fileName.substring(1,999);

						if (firstChar == '1') {
							// CSV to JSON
							csv().fromFile(files[file]).then((jsonObj)=>{
								console.log("DEPTH OF JSON DATA: " + getDepth(jsonObj));
								// Convert all numberic strings to their float equiv so the DB gets the right datatype
								Object.keys(jsonObj).forEach(function(key) {
									Object.keys(jsonObj[key]).forEach(function(subKey) {
										if (subKey != "Key" && subKey != "Name") {
											(jsonObj[key])[subKey] = parseFloat((jsonObj[key])[subKey]);
										}
									});
								});

								// Connect to DB and insert new points
								MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
									if (err)
										reject(err)

									var dbo = db.db("precursor");

									//dbo.collection(collectionToUse).drop();

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
			}
		});
	});

	var pugParams = {};
	execPromise.then(function(resultPromise) {
		if (resultPromise == -1) {
			console.log("NO SOLUTIONS FOUND");
			MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
				var dbo = db.db("stoich");
				var query = {};
				var sorter = {Score : 1};
				var filter = {projection:{_id:0, Name:1, Mass:1, Score:1}};
				dbo.collection(elementList).find(query, filter).sort(sorter).limit(50).toArray(function(err, result) {
					pugParams.stoichs = []

					if (result.length != 0) {
						var pugData = [Object.keys(result[0])];

						Object.keys(result).forEach(function(key) {
							var row = [];

							Object.keys(result[key]).forEach(function(subKey) {
								row.push((result[key])[subKey]);
							});

							pugData.push(row);
						});

						pugParams.stoichs = [pugData[0], pugData.slice(1)];
					}

					pugParams.precursor = [];
					pugParams.precursors = [
						{Name: "Li2S"},
						{Name: "Al2S3"},
						{Name: "Al2O3"},
						{Name: "LiAlO2"},
						{Name: "Li2O"},
						{Name: "SnS2"},
						{Name: "LiCl"}
					]

					//console.log(pugParams);
					res.render("periodicTable", pugParams);
				});
			});
		}
		else {
			var collectionName = resultPromise;
			console.log(jobID + " FINISHED " + collectionName);

			// Connect to DB and extract points with good scores, sorted by score
			MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
				var dbo = db.db("stoich");
				var query = {};
				var sorter = {Score : 1};
				var filter = {projection:{_id:0, Name:1, Mass:1, Score:1}};
				dbo.collection(collectionName).find(query, filter).sort(sorter).limit(50).toArray(function(err, result) {
					if (result.length != 0) {
						var pugData = [Object.keys(result[0])];

						Object.keys(result).forEach(function(key) {
							var row = [];

							Object.keys(result[key]).forEach(function(subKey) {
								row.push((result[key])[subKey]);
							});

							pugData.push(row);
						});

						pugParams.stoichs = [pugData[0], pugData.slice(1)];

						MongoClient.connect(url, { useUnifiedTopology: true }, function(err2, db2) {
							var dbo = db2.db("precursor");
							var query = {};
							var sorter = {Score : 1};
							var filter = {projection:{_id:0, Key:0}};
							dbo.collection(collectionName).find(query, filter).sort(sorter).limit(numPoints).toArray(function(err, result) {
								var pugData = [Object.keys(result[0])];

								Object.keys(result).forEach(function(key) {
									var row = [];

									Object.keys(result[key]).forEach(function(subKey) {
										row.push((result[key])[subKey]);
									});

									pugData.push(row);
								});

								var diagramData = {};
								diagramData.data = [];
								var largestScore = 0;
								console.log("Result length: " + Object.keys(result[0]).length);
								if (Object.keys(result[0]).length > 3) {
									Object.keys(result).forEach(function(key) {
										var row = {};

										row.A = (result[key])[Object.keys(result[key])[0]];
										row.B = (result[key])[Object.keys(result[key])[1]];
										row.C = (result[key])[Object.keys(result[key])[2]];
										row.label = (result[key])[Object.keys(result[key])[Object.keys(result[key]).length - 1]];

										if (row.label > largestScore) {
											largestScore = row.label
										}

										diagramData.data.push(row);
									});
								}

								diagramData.largestScore = largestScore;
								//console.log(diagramData);

								pugParams.diagram = diagramData;
								pugParams.precursor = [pugData[0], pugData.slice(1)];
								pugParams.precursors = [
									{Name: "Li2S"},
									{Name: "Al2S3"},
									{Name: "Al2O3"},
									{Name: "LiAlO2"},
									{Name: "Li2O"},
									{Name: "SnS2"},
									{Name: "LiCl"}
								]
								//console.log(pugParams);
								res.render("periodicTable", pugParams);
							});
						});
					}
					else {
						res.render("error", {text: "Database Selection Failed For " + elementList});
					}
					db.close();
				});
			});
		}
	}, function(err) {
		console.log(err);
		res.render("error", {text: "Calculator failed to run, please wait and try again."})
	});
});

router.get('/calc/stoich/:quantity/:elements', function(req, res){
	// get the list of elements from the request
	var elements = req.params.elements.split("-");
	var quantityMargin = req.params.quantity.split("-");

	// get the quantity of points from the request
	var numPoints = parseInt(quantityMargin[0]);
	if (isNaN(numPoints)) {
		numPoints = 20;
	}

	var margin = parseFloat(quantityMargin[1]);
	if (isNaN(margin)) {
		margin = 0.003;
	}

	// Order Elements for consistency
	orderedElements = new Array(112).fill(null);
	for (var i = 0; i < (elements.length); i++) {
		var eleIndex = VALID_ELEMENTS.indexOf(elements[i].replace(/[0-9]/g,''));
		orderedElements.splice(eleIndex,1,elements[i]);
	}
	var elements = orderedElements.filter(function (el) {
		return el != null;
	});

	// build the execution string to be called in EXEC
	var execString = 'samply.exe --stoichs=\"';
	var elementList = '';
	for (var i = 0; i < (elements.length); i++) {
		if (VALID_ELEMENTS.includes(elements[i].replace(/[0-9]/g,''))) {
			elementList = elementList + elements[i];
		}
	}
	execString = execString + elementList;

	// async check if collection exists while building the rest of the exec string
	var dbExistsCheck = new Promise(function(resolve, reject) {
		MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
			if (err)
				reject(err);

			var dbo = db.db("stoich");
			dbo.listCollections({name: elementList}).next(function(err, collinfo) {
				if (err)
						reject(err);

				if (collinfo) {
					var query = {};
					var sorter = {Score : 1};
					var filter = {projection:{_id:0, Name:1, Mass:1, Score:1}};

					if (err)
						console.log(err);

					dbo.collection(elementList).find(query, filter).sort(sorter).limit(numPoints).toArray(function(err, result) {
						console.log("Pre-existing data found, using this instead: " + result.length + " results");
						if (result.length != 0) {
							var pugData = [Object.keys(result[0])];

							Object.keys(result).forEach(function(key) {
								var row = [];

								Object.keys(result[key]).forEach(function(subKey) {
									row.push((result[key])[subKey]);
								});

								pugData.push(row);
							});
							var pugParams = {};

							pugParams.stoichs = [pugData[0], pugData.slice(1)];
							pugParams.precursors = [
								{Name: "Li2S"},
								{Name: "Al2S3"},
								{Name: "Al2O3"},
								{Name: "LiAlO2"},
								{Name: "Li2O"},
								{Name: "SnS2"},
								{Name: "LiCl"}
							]
							//console.log(pugData);

							res.render("periodicTable", pugParams);
						}
						else {
							res.render("error", {text: "Table " + elementList + " exists, but no data was extracted"});
						}
						db.close();
					});
				}
				else {
					resolve();
				}
			});
		});
	});

	execString = execString + '\" --margin=' + margin.toString() + ' --samples=1000 --mode=0'
	var jobID = uuidv4();

	var collectionToUse = "";

	dbExistsCheck.then(function(result) {
		// Create promise so we can run code with a guarantee this finished first
		var execPromise = new Promise(function(resolve, reject) {
			console.log(jobID + " RUNNING:  " + execString);

			// Run the subprocess
			exec(execString, {
				cwd: exeDir
			}, function(error, stdout, stderr) {
				if (error)
					reject(error);

				// Maybe put this in a log file instead of cluttering the console
				// console.log(stdout.toString());

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
								//console.log("DEPTH OF JSON DATA: " + getDepth(jsonObj));
								// Convert all numberic strings to their float equiv so the DB gets the right datatype
								Object.keys(jsonObj).forEach(function(key) {
									Object.keys(jsonObj[key]).forEach(function(subKey) {
										if (subKey != "Key" && subKey != "Name") {
											(jsonObj[key])[subKey] = parseFloat((jsonObj[key])[subKey]);
										}
									});
								});

								// Connect to DB and insert new points
								MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
									if (err)
										reject(err)

									var dbo = db.db("stoich");
									//dbo.collection(collectionToUse).drop();
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
			MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
				var dbo = db.db("stoich");
				var query = {};
				var sorter = {Score : 1};
				var filter = {projection:{_id:0, Name:1, Mass:1, Score:1}};

				if (err)
					console.log(err);

				dbo.collection(collectionToUse).find(query, filter).sort(sorter).limit(numPoints).toArray(function(err, result) {
					//console.log("RESULT LEN " + result.length);
					if (result.length != 0) {
						var pugData = [Object.keys(result[0])];

						Object.keys(result).forEach(function(key) {
							var row = [];

							Object.keys(result[key]).forEach(function(subKey) {
								row.push((result[key])[subKey]);
							});

							pugData.push(row);
						});
						var pugParams = {};

						pugParams.stoichs = [pugData[0], pugData.slice(1)];
						pugParams.precursors = [
							{Name: "Li2S"},
							{Name: "Al2S3"},
							{Name: "Al2O3"},
							{Name: "LiAlO2"},
							{Name: "Li2O"},
							{Name: "SnS2"},
							{Name: "LiCl"}
						]
						//console.log(pugData);

						res.render("periodicTable", pugParams);
					}
					else {
						res.render("error", {text: "No Data For " + req.params.elements});
					}
					db.close();

					req.session.lastStoich = collectionToUse;
				});
			});
		}, function(err) {
			console.log(err);
			res.render("error", {text: "Calculator failed to run, please wait and try again."})
		});
	}, function(err){
		console.log(err);
		res.render("error", {text: "DB EXISTS query failed, please wait and try again."})
	});
});

module.exports = router;
