const express = require('express');
const uuidv4 = require('uuid/v4');
const bcrypt = require('bcrypt');

var router = express.Router();

router.post('/', function(req,res){
    console.log("POST Req, Authed")
    // TODO: Authentication for users either from database or passphrase
    req.session.authed = true;
    req.session.id = uuidv4();
    req.session.save();
    res.redirect("../ptable"); // send to top level then to ptable subrouter
    console.log("Redirected to " + req.baseUrl + "/ptable")
});

module.exports = router;
