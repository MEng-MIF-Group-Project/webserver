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

router.post('/calc/pre', function(req, res){
    exec('matsys.exe --stoichs="Li:Al:S:O" --precursors="Li#2:S Al#2:S#3 Al#2:O#3 Li:Al:O#2 Li#2:O" --margin=0.003 --samples=1000 --mode=1', {
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
    });
});

router.post('/calc/stoich', function(req, res){
    exec('matsys.exe --stoichs="Li:Al:S:O" --margin=0.05 --samples=1000 --mode=0', {
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
    });
});

module.exports = router;
