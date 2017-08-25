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
	var unix_output;
	var natural_output;
	var date_natural;
	var date_unix;	


	input = req.params.id;
	date_unix = moment(input, 'X', true).isValid();

	if(moment(input).isValid()){
		natural_output = input;
		unix_output = moment(input).unix();
	}
	else if(date_unix){
		natural_output = moment.unix(input).format('YYYY-MMM-DD');;
		unix_output = input;
	}
	else {
		natural_output = "null";
		unix_output = "null"
	};	

	var output = '{ "unix": ' + unix_output + ', "natural": ' + '"' + natural_output + '" }';
  	res.render('index', { title: 'OUTPUT', head: "OUTPUT", message: output });

    //res.send(output);
});


app.listen(process.env.PORT || 3000)
console.log("Server is listening you!");