'use strict';

var express = require('express');
var watson_conv = require('watson-developer-cloud/conversation/v1');
var app = express();


app.use(express.json());
app.use(express.static(__dirname + '/public'));
var port = process.env.PORT || 3000
app.listen(port, function(){
  console.log("Server starting on 3000!");
});
/**
 * Instantiate the Watson Conversation Service
 */
var conversation = new watson_conv({
  url: 'https://gateway.watsonplatform.net/assistant/api',
  username: process.env.CONVERSATION_USERNAME || 'c134c9f8-ed80-4000-8429-b1ba3c326084',
  password: process.env.CONVERSATION_PASSWORD || 'P1LZf5dFzM4K',
  version: '2017-05-26'
});

/**
 * Calls the conversation message api.
 * returns a promise
 */

 var message = function(text, context) {
  var payload = {
    workspace_id: process.env.WORKSPACE_ID || '71f59d91-7b9c-4717-ae2e-376c09b9dcff',
    input: {
      text: text
    },
    context: context
  };
  return new Promise((resolve, reject) =>
    conversation.message(payload, function(err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    })
  );
};
var context = "";
app.post('/api/bot',function(req,res) {
  console.log("Got request for Sennovate bot");
  console.log("Request is: ",req.body);

  var workspace = '252aa1f1-6adf-40e5-a1ee-538359ccd791';

  if(!workspace){
    console.log("No valid workspace id specified");
  }

  if (req.body){
    if(req.body.input){
      var input = req.body.input.text;
    }

    if(req.body.input.text == "") {
       context = undefined;
    }
    else if(req.body.context){
      context = req.body.context;
    }
  }

  message(input, context)
  .then(response1 => {
    // APPLICATION-SPECIFIC CODE TO PROCESS THE DATA
    // FROM CONVERSATION SERVICE
    console.log(JSON.stringify(response1, null, 2), '\n--------');

    // invoke a second call to conversation
    return res.json(response1);
    context = response1.context;
  });
  
});
 