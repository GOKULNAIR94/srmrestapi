'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const restService = express();
var https = require('https');
var fs = require('fs'),
    path = require('path');
restService.use(bodyParser.urlencoded({
    extended: true
}));
restService.use(bodyParser.json());

restService.get('/', onRequest);
restService.use(express.static(path.join(__dirname, '/public')));


function onRequest(request, response){
  response.sendFile(path.join(__dirname, '/public/index.html'));
}

var clientId = "91643e161d13ccbdcfc1681ce81da56c18ac44ec98558b07da6980e6426bfd32";
var clientSecret = "0242617904b60702b5701d874cf928de74066ba5f3a9221de3720407da913152";
var redirect_uri = "https://www.getpostman.com/oauth2/callback";
var scope = "engage";

var code = ""; //"3b8f2c37f46d3f80c46a32de9eb152e3fdf0d06bdf86bcf187d2bc99f22404b5";
var oldToken = ""; //"ef4b7462de8253e04b0cc6fdf53bec47f37d6f7799d42274e009b95edef074b3";
var newToken = "";

restService.get('/startButton',function(request,response){
    
    var options = {
        "method": "GET",
        "hostname": "gatekeeper.vitrue.com",
        "path": "/oauth/authorize?client_id=" + clientId + "&client_secret=" + clientSecret + "&redirect_uri=" + redirect_uri + "&scope=" + scope + "&response_type=code",
//        "path": "/oauth/authorize?client_id=91643e161d13ccbdcfc1681ce81da56c18ac44ec98558b07da6980e6426bfd32&client_secret=0242617904b60702b5701d874cf928de74066ba5f3a9221de3720407da913152&redirect_uri=https://www.getpostman.com/oauth2/callback&scope=engage&response_type=code",
        "headers": {
            "cache-control": "no-cache"
        }
    };
    
    var req = https.request(options, function (res) {
    var chunks = [];

    res.on("data", function (chunk) {
        chunks.push(chunk);
    });

    res.on("end", function () {
            var body = Buffer.concat(chunks);
            console.log(body.toString());
            var output = body.toString();
            response.json( output );
        });
    });

    req.end();
    
});

restService.post('/getToken',function(request,response){
    
    code = request.body.data;
    var options = {
        "method": "POST",
        "hostname": "gatekeeper.vitrue.com",
        "path": "/oauth/token?client_id=" + clientId + "&client_secret=" + clientSecret + "&redirect_uri=" + redirect_uri + "&code=" + code + "&grant_type=authorization_code",
//        "path": "/oauth/token?client_id=91643e161d13ccbdcfc1681ce81da56c18ac44ec98558b07da6980e6426bfd32&client_secret=0242617904b60702b5701d874cf928de74066ba5f3a9221de3720407da913152&redirect_uri=https://www.getpostman.com/oauth2/callback&code=" + code + "&grant_type=authorization_code",
        "headers": {
            "cache-control": "no-cache"
        }
    };
    console.log( "path : " + options.path );
    var req = https.request(options, function (res) {
    var chunks = [];

    res.on("data", function (chunk) {
        chunks.push(chunk);
    });

    res.on("end", function () {
            var body = Buffer.concat(chunks);
            console.log(body.toString());
            var output = body.toString();
            response.json( output );
        });
    });

    req.end();
    
});

restService.post('/refreshToken',function(request,response){
    oldToken = request.body.data;
    console.log( "oldTkn : " + oldToken );
    
    var options = {
        "method": "POST",
        "hostname": "gatekeeper.vitrue.com",
        "path": "/oauth/token",
        "path": "/oauth/token?client_id=" + clientId + "&client_secret=" + clientSecret + "&redirect_uri=" + redirect_uri + "&code=" + code + "&refresh_token=" + oldToken + "&grant_type=refresh_token",
        "headers": {
            "cache-control": "no-cache",
        }
    };
    console.log( "path : " + options.path );
    var req = https.request(options, function (res) {
    var chunks = [];

    res.on("data", function (chunk) {
        chunks.push(chunk);
    });

    res.on("end", function () {
            var body = Buffer.concat(chunks);
            console.log(body.toString());
            var output = body.toString();
            response.json( output );
        });
    });

//    req.write(JSON.stringify(  ));
    req.end();
    
});

restService.post('/getData',function(request,response){
    console.log("Get dAta");
    newToken = request.body.data;
    var options = {
        "method": "GET",
        "hostname": "public-api.vitrue.com",
        "port": null,
        "path": "/engage/v1/messages?bundleId=34442",
        "headers": {
            "authorization": "Bearer " + newToken,
            "cache-control": "no-cache"
        }
    };

    var req = https.request(options, function (res) {
        var chunks = [];

        res.on("data", function (chunk) {
            chunks.push(chunk);
        });

        res.on("end", function () {
            var body = Buffer.concat(chunks);
            console.log(body.toString());
            var output = body.toString();
            response.json( output );
        });
    });

    req.end();

});

restService.listen((process.env.PORT || 8888), function() {
  console.log("Server up and listening");
});