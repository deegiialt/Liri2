require("dotenv").config();

var keys = require("./keys.js");

var Twitter = require("twitter");
var Spotify = require("node-spotify-api");

var fs = require("fs");

//keys.spotify exports
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var commands = process.argv[2];

switch(commands) {
	case "my-tweets":
		myTweets();
		break;
	case "spotify-this-song":
		mySpotify();
		break;
	case "movie-this":
		myMovie();
		break;
	case "do-what-it-says":
		doWhatItSays();
		break;
}

//show last 20 tweets and when they were created
function myTweets() {
	var params = {screen_name: 'nodejs', count: 20};
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
	  if (!error) {
	  	for(i = 0; i < tweets.length; i++) {
	  		console.log("Tweet: " + tweets[i].text);
	  		console.log("Tweet was created at: " + tweets[i].created_at)
	  	}
	  }
	});
}

//making song global variable for doWhatItSays function

//show info about: artist, song name, preview of link of song, album
function mySpotify() {
	var song = "";
	for(i = 3; i < process.argv.length; i++) {		
			if (i > 3 && process.argv.length ) {
				song += "+" + process.argv[i];
			} else {
				song += process.argv[i];
			}
	}
	//if no song is provided, default is "The Sign" by Ace of Base.
	if(!song) {
		song +="the sign";
		// console.log("is working");
	}

	spotify.search({ type: 'track', query: song }, function(err, data) {
		if (err) {
			return console.log('Error occurred: ' + err);
		}
		var tracks = data.tracks.items[0];
		console.log("Song name: " + tracks.name); 
		console.log(`Artist(s): `+ tracks.artists[0].name);

		//only log the preview url if it exists 
		if(tracks.preview_url) {
			console.log(`Preview of link: `+ tracks.preview_url);
		} else {
			console.log(`Preview of link unavailable for this song.`);
		}
		console.log(`Album: `+ tracks.album.name);
	});
}

//making movieName global variable for doWhatItSays function
var movieName = ""; 
function myMovie() {
	var request = require("request");
	for(i = 3; i < process.argv.length; i++) {		
		if (i > 3 && process.argv.length ) {
			movieName += "+" + process.argv[i];
		} else {
			movieName += process.argv[i];
		}
	}
	//if no movie, default is "Mr.Nobody" http://www.imdb.com/title/tt0485947/		
	if(!movieName) {
		movieName += "Mr.Nobody"; 
	}

	var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
	request(queryUrl, function(error, response, body) {
		if (!error && response.statusCode === 200) {
			console.log("title: " + JSON.parse(body).Title);
			console.log("year: " + JSON.parse(body).Year);
			console.log("imdb rating: " + JSON.parse(body).imdbRating);
			console.log("Rotten Tomatoes rating: " + JSON.parse(body).Ratings[1].Value);
			console.log("country: " + JSON.parse(body).Country);
			console.log("language: " + JSON.parse(body).Language);
			console.log("plot: " + JSON.parse(body).Plot);
			console.log("actors: " + JSON.parse(body).Actors);
	  	}
	});
}

//uses fs node package. Takes text from random.txt
function doWhatItSays() {
	fs.readFile("random.txt", "utf8", function(error, data) {
		if (error) {
		return console.log(error);
	}

	// console.log(data);
	// //went from string to array. Splits on commas and makes each movie to an array member
	var dataArr = data.split(",");
	if(dataArr[0] == "spotify-this-song") {
		song += dataArr[1];
		mySpotify();
	} else if (dataArr[0] == "my-tweets") {
		myTweets();
	} else if (dataArr[0] == "movie-this") {
		movieName += dataArr[1];
		myMovie();
	}
	// console.log(dataArr[0]); //action
	// console.log(dataArr[1]); //item
	})
}