const express = require('express');
const uuidv4 = require('uuid/v4');
const bcrypt = require('bcrypt');

var router = express.Router();

router.post('/login', function(req,res){
    console.log("POST Req to /login, Authed")
    // TODO: Authentication for users either from database or passphrase
    req.session.authed = true;
    req.session.id = uuidv4();
    req.session.save();
    res.redirect("../ptable"); // send to top level then to ptable subrouter
    console.log("Redirected to " + req.baseUrl + "/ptable")
});

router.get('/logout', function(req,res){
    console.log("GET Req to /logout, Logged out")
    // TODO: Authentication for users either from database or passphrase
    req.session.authed = false;
    req.session.destroy();
    res.redirect("../"); // send to top level
    console.log("Redirected to " + req.baseUrl + "/")
});

module.exports = router;
