var express = require('express');
var app = express();
var path = require('path');
var jade = require('jade');
var validUrl = require('valid-url');

//-------------------------------------------------------------------------------------
//Require/import the mongodb native drivers.
var mongodb = require('mongodb');

//Use "MongoClient" interface in order to connect to a mongodb server.
var MongoClient = mongodb.MongoClient;

// Connection URL. This is mongodb server address.
var url = process.env.MONGODB_URI;      
//---------------------------------------------------------------------------------------

app.set('views', __dirname + '/');
app.set('view engine', 'jade');

app.get('/', function(req, res) {
      res.sendFile(path.join(__dirname + '/index.htm'));
});

var input;
var original_url;
var rnd_short;
var short_url;

app.get('/new/:id*', function(req, res) {

	input = req.params.id;
	original_url = req.param('id') + req.param(0);

  	var webStr1 = "http://www.";
	var webStr2 = "https://www."; //it seams validUrl passes string like "http://ww."
	
	if(validUrl.isWebUri(original_url) && (original_url.includes(webStr1) || original_url.includes(webStr2) ) ){
 		rnd_short= 1000 + Math.floor(Math.random() * (9999 -1001) + 1);
		short_url = "https://freecodecamp-url-shortener-microservice.glitch.me/" + rnd_short;
		//---------------------------------------------------------------------------------------
		// Use connect method to connect to the Server
		MongoClient.connect(url, function (err, db) {
		if (err) {
			console.log('Unable to connect to the mongoDB server. Error:', err);
		} else {
			console.log('Connection established');

		    // do some work here with the database.
		    var urlCollection = db.collection('urlCollection');
		    urlCollection.insert({ _id: rnd_short, "original_url" : original_url, "short_url" : short_url});
		      
	      	var output = '{ "original_url":' + '"' + original_url + '"' + ', "short_url":' + '"' + short_url + '" }';
	  	    res.render('index', { title: 'FCC URL Shortener', message: output });

	      	//Close connection
		    db.close();
		  }
		});
		//--------------------------------------------------------------------------------------

		//var output = '{ "original_url":' + '"' + original_url + '"' + ', "short_url":' + '"' + short_url + '" }';
	  	//res.render('index', { title: 'FCC URL Shortener', message: output });
  	}else{res.send('{"Error:"' + '"' + original_url + '" is not a valid URL"}');}
});

app.get('/:id', function(req, res) {

	if(!(input === "favicon.ico")){

	var redirect_url = "";

	//---------------------------------------------------------------------------------------
	// Use connect method to connect to the Server
	MongoClient.connect(url, function (err, db) {
		if (err) {
			console.log('Unable to connect to the mongoDB server. Error:', err);
		} else {
		    console.log('Connection established');

	    	// do some work here with the database.
	    	var urlCollection = db.collection('urlCollection');
	    	var input = parseInt(req.params.id);
	    	//var field = "_id";
			//var query = {};
			//query[field] = input;
	    	urlCollection.findOne( {_id: input}, {"_id": 0, "original_url": 1}, function(error, doc){
	    		if (err){res.send("Error:" + error)}
	    		if (doc){	
  						redirect_url = doc.original_url;
  						res.redirect(redirect_url);
	    		} else {
              		res.send('{"error":"this URL is not on the database."}')
            	}
	    	});
			//Close connection
			db.close();
		}
	});
	//--------------------------------------------------------------------------------------

  }
  
});

app.listen(process.env.PORT || 3000)
console.log("Server is listening you!");