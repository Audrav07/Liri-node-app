//load required node modules//
//grab data from keys.js//
var apiKeys = require('./keys.js');

var twitterKeys = apiKeys.twitterKeys;

//npm module to access twitter api
var Twitter = require('twitter');


//npm module used to access spotify api
var Spotify = require('node-spotify-api');

//npm module to access omdb api
var request = require('request');


//read the random.txt file

var fs = require('fs');



var filename = './log.txt';


var command = process.argv[2];

var argument = "";

//controller function determines which command is taken
argumentChoices(command, argument);


//switch operationg used to determine which command to take
function argumentChoices(command, argument){

	argument = getThirdArgument();

	switch (command) {
		
		// Gets list of tweets.
		case "my-tweets": 
		getMyTweets();
		break;

		// Gets song information.
		case "spotify-this-song":

		var songTitle = argument;

		if(songTitle === ""){
			spotifyThisSong('The Sign Ace of Base');
		}
		
		break;

		// Gets movie information.
		case "movie-this":

		// First gets movie title argument.
		var movieTitle = argument;

		// If no movie title provided, defaults to specific movie.
		if (movieTitle === "") {
			getMovie("Mr. Nobody");
		} else{
			getMovie(movieTitle);
		}
		break;

		// Gets text inside file, and uses it to do something.
		case "do-what-it-says": 
		doWhatItSays();
		break;
	};
};




function getThirdArgument(){
	argumentArray = process.argv;
	for(var index = 3; index < argumentArray.length; index++){
		argument += argumentArray[index];
	}
	return argument;
}

function getMyTweets(){
	// var client = new Twitter(twitKeys.twitterKeys);
	var params ={screen_name: 'RamonaFlow2018', count: 20};

	 var client = new Twitter({
        consumer_key: twitterKeys.consumer_key,
        consumer_secret: twitterKeys.consumer_secret,
        access_token_key: twitterKeys.access_token_key,
        access_token_secret: twitterKeys.access_token_secret
    });

	client.get('statuses/user_timeline', params, function(error, tweets, response) {
		if(error) { // if there IS an error
			console.log('Error occurred: ' + error);
		} else { // if there is NO error
	  	console.log("My 20 Most Recent Tweets");
	  	console.log("");

	  	for(var i = 0; i < tweets.length; i++) {
	  		console.log("( #" + (i + 1) + " )  " + tweets[i].text);
	  		console.log("Created:  " + tweets[i].created_at);
	  		console.log("");
	  	}
	  }
	});
}

function spotifyThisSong(argument) {
	
    // spotify key from exported file
    var spotifyKeys = apiKeys.spotifyKeys;
   
    var spotify = new Spotify({
    	id: spotifyKeys.id,
    	secret: spotifyKeys.secret
    });
    // change to fullInput
    spotify.search({ type: 'track', query: argument }, function(err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        } else if (!err) {
            // store song object
            var songResponse = data.tracks.items[0];
           
            // store artist names
            var artist = songResponse.artists[0].name;
            // store song name
            var songs = songResponse.name;
            // store album song is from
            var album = songResponse.album.name;
            // store preview link of the song from spotify
            var url = songResponse.preview_url;

            console.log("Song Title: " + songs + " Artist Name: " + artist + " Album Title: "+ album);
            console.log("Preview Link: " + url);
            

            // Log output to log.txt
            writeToLog("\n=============================\n");
            writeToLog("Song Title: " + songs + " Artist Name: " + artist + " Album Title: " + album);
            writeToLog("Preview Link: " + url);
            
        }
    });
}; 


function getMovie(movieTitle){
	
var movieUrl = "http://www.omdbapi.com/?t=" + movieTitle + "&y=&plot=short&apikey=trilogy";
	request(movieUrl, function(error, response, body) {
		if(!error && response.statusCode == 200){
			// var data = [];
			var movie = JSON.parse(body);


			writeToLog("Movie Title: " + movie.Title);
			writeToLog("Release Year: " + movie.Year);
			writeToLog("IMDB Rating: " + movie.imdbRating);
			writeToLog("Country Produced In: " + movie.Country);
			writeToLog("Language: " + movie.Language);
			writeToLog("Plot: " + movie.Plot);
			writeToLog("Actors: " + movie.Actors);
			// writeToLog("Rotten Tomatoes Rating: " + movie.Rating[].Value);
			writeToLog("Rotten Tomatoes URL: " + movie.tomatoURL);

			console.log("Movie Title: " + movie.Title);
			console.log("Release Year: " + movie.Year);
			console.log("IMDB Rating: " + movie.imdbRating);
			console.log("Country Produced In: " + movie.Country);
			console.log("Language: " + movie.Language);
			console.log("Plot: " + movie.Plot);
			console.log("Actors: " + movie.Actors);
			// writeToLog("Rotten Tomatoes Rating: " + movie.Rating[].Value);
			console.log("Rotten Tomatoes URL: " + movie.tomatoURL);
		

		}
		});
}

	



function doWhatItSays() {

	fs.readFile("random.txt", "utf8", function(error, data) {
		console.log(data);
    writeToLog(data);
    var dataArr = data.split(',')

    if (dataArr.length == 2) {
      argumentChoices(dataArr[0], dataArr[1]);
    } else if (dataArr.length == 1) {
      argumentChoices(dataArr[0]);
    }

  });
}



    



var writeToLog = function(data) {
  fs.appendFile("log.txt", '\r\n\r\n');

  fs.appendFile("log.txt", JSON.stringify(data), function(err) {
    if (err) {
      return console.log(err);
    }

    console.log("log.txt was updated!");
  });
}

