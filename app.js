/**
 * Basic chatbot that get the request like an input, process the information and send an output
 */
var express = require('express');
var app = express();
var request = require('request');
const bodyParser = require('body-parser');

const accountSid = process.env.SID;
const authToken = process.env.KEY;


const client = require('twilio')(process.env.SID, process.env.KEY);
const MessagingResponse = require('twilio').twiml.MessagingResponse;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/incoming', (req, res) => {
  const twiml = new MessagingResponse();
  if(req.body.Body.toLowerCase().trim()!="hi" && req.body.Body.toLowerCase().trim()!="hello" && req.body.Body.toLowerCase().trim()!="test" && req.body.Body.toLowerCase().trim()!="help"){

  request('https://api.duckduckgo.com/?skip_disambig=1&format=json&pretty=1&q='+req.body.Body, function (error, response, body) {
    body = JSON.parse(body)
    console.log('body:', body["Abstract"]);
    
    if(body["Abstract"] == ""){
	    body["Abstract"]= body["RelatedTopics"][0]["Text"]
	  }
    
    var msg = twiml.message(`*`+body["Heading"]+`*

`+body["Abstract"]);
  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
  });
  
  }
  else{
    var msg = twiml.message(`Hey how are you! im a bot for Technical Services`)
    res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
  }  
});

app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

var listener = app.listen(process.env.PORT, function() {
  console.log('Backend running at pot ' + listener.address().port);
});

