'use strict';

var express = require('express');
var watson_conv = require('watson-developer-cloud/conversation/v1');
var app = express();


app.use(express.json());
app.use(express.static(__dirname + '/public'));
app.listen(3000, function(){
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
    workspace_id: process.env.WORKSPACE_ID || '252aa1f1-6adf-40e5-a1ee-538359ccd791',
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
  // var params = {
  //   workspace_id: workspace,
  //   context: {},
  //   input: {}
  // };

  

  // conversation.message(params, function(err, data){
  //   if(err){
  //     console.error("Error in sending message: ",err);
  //     return res.status(err.code || 500).json(err);
  //   }

  //   console.log("Response: ", data);

  //   return res.json(data);
  // });






// This example makes two successive calls to conversation service.
// Note how the context is passed:
// In the first message the context is undefined. The service starts a new conversation.
// The context returned from the first call is passed in the second request - to continue the conversation.
// message('first message', undefined)
//   .then(response1 => {
//     // APPLICATION-SPECIFIC CODE TO PROCESS THE DATA
//     // FROM CONVERSATION SERVICE
    // console.log(JSON.stringify(response1, null, 2), '\n--------');

//     // invoke a second call to conversation
//     return message('second message', response1.context);
//   })
//   .then(response2 => {
//     console.log(JSON.stringify(response2, null, 2), '\n--------');
//     console.log(
//       'Note that the two reponses should have the same context.conversation_id'
//     );
//   })
//   .catch(err => {
//     // APPLICATION-SPECIFIC CODE TO PROCESS THE ERROR
//     // FROM CONVERSATION SERVICE
//     console.error(JSON.stringify(err, null, 2));
//   });
