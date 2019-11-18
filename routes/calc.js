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

var router = express.Router();

const url = 'mongodb://localhost:32768';
const client = new MongoClient(url, { useUnifiedTopology: true });

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

router.get('/calc/pre/:elements/:precursor', function(req, res){
    // get the list of elements from the request
    var elements = req.params.elements.split("-");
    console.log(elements);

    // to avoid hanging the browser
    res.render('periodicTable', {});

    /*exec('matsys.exe --stoichs="Li:Al:S:O" --precursors="Li#2:S Al#2:S#3 Al#2:O#3 Li:Al:O#2 Li#2:O" --margin=0.003 --samples=1000 --mode=1', {
        cwd: exeDir
    }, function(error, stdout, stderr) {
        console.log(stdout.toString());

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

                        res.send("lmao yeet")
                    });
                }
            }
        });
    });*/
});

router.get('/calc/stoich/:elements', function(req, res){
    // get the list of elements from the request
    var elements = req.params.elements.split("-");
    console.log(elements);

    // build the execution string to be called in EXEC 
    var execString = 'matsys.exe --stoichs=';
    for (var i = 0; i < (elements.length - 1); i++) {
        if (VALID_ELEMENTS.includes(elements[i])) {
            execString = execString + elements[i] + ":"
        }
    }

    if (VALID_ELEMENTS.includes(elements[elements.length - 1])) {
        execString = execString + elements[elements.length - 1]
    }
    execString = execString + ' --margin=0.05 --samples=1000 --mode=0'

    console.log(execString);

    // to avoid hanging the browser
    res.render('periodicTable', {});

    /*exec('matsys.exe --stoichs="Li:Al:S:O" --margin=0.05 --samples=1000 --mode=0', {
        cwd: exeDir
    }, function(error, stdout, stderr) {
        console.log(stdout.toString());

        glob(path.join(exeDir, "*.csv"), {}, (err, files) => {
            for (var file in files) {
                var fileName =  path.basename(files[file], path.extname(files[file]));
                var firstChar = fileName.charAt(0);
                var notFirstChar = fileName.substring(1,999);

                if (firstChar == '0') {
                    csv().fromFile(files[file]).then((jsonObj)=>{
                        client.connect(function(err) {
                            collection = client.db('stoichs').collection(notFirstChar);
                            collection.insertMany(jsonObj, function(err, doc) {});
                            client.close();
                        });

                        fs.unlink(files[file], function (err) {
                            if (err) throw err;
                            // if no error, file has been deleted successfully
                            console.log('File deleted!');
                        });

                        res.send("lmao yeet")
                    });
                }
            }
        });
    });*/
});

module.exports = router;
