var request = require("request");

var accessToken = 'demo'

var url = 'https://api.humanapi.co/v1/human/profile/?access_token=demo'


request(url, function(error, response, body) {
  var obj = JSON.parse(body);
  console.log(obj);
  
  console.log(response.body);
});





  