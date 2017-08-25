var express = require('express');
var app = express();
var path = require('path');
var jade = require('jade');

app.set('views', __dirname + '/');
app.set('view engine', 'jade');

app.get('/', function(req, res) {
      res.sendFile(path.join(__dirname + '/index.htm'));
});


app.get('/:id', function(req, res) {
	var input;
	var original_url;
	var short_url;


	input = req.params.id;
	original_url = "https://natural.com";
	short_url = "https://short.com";

	var output = '{ "original_url": ' + '"' + original_url + '"' + ', "short_url": ' + '"' + short_url + '" }';
  	res.render('index', { title: 'OUTPUT', head: "OUTPUT", message: output });

    //res.send(output);
});


app.listen(process.env.PORT || 3000)
console.log("Server is listening you!");