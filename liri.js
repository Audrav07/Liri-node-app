//load required node modules//
//grab data from keys.js//
var keys = require('./keys.js');

var twitter = require('twitter');

var client = new Twitter(keys.twitterKeys);


//require the sportify npm app
var spotify = require('spotify');

//require the request npm app
var request = require('request');


//require the file system node app

var fs = require('fs');

//stored agument arrays//
var nodeArgv =process.argv;
var command =process.argv[2];







//showtweets
function showTweets(){
	//display last 20 tweets
	var screenName = {screen_name: 'audg007'};
	client.get('statuses/user_timeline', screenName, function(error, tweets, response){
		if (!error){
			console.log(tweets);
		}
	})
}

