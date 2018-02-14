require("dotenv").config();

var keys = require("./keys.js");

var Twitter = require("twitter");
var Spotify = require("node-spotify-api");

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

//show info about: artist, song name, preview of link of song, album
//if no song is provided, default is "The Sign" by Ace of Base.
function mySpotify() {
	spotify.search({ type: 'track', query: 'All the Small Things' }, function(err, data) {
		if (err) {
			return console.log('Error occurred: ' + err);
		}
		console.log(data); 
	});
}

// * Title of the movie.
// * Year the movie came out.
// * IMDB Rating of the movie.
// * Rotten Tomatoes Rating of the movie.
// * Country where the movie was produced.
// * Language of the movie.
// * Plot of the movie.
// * Actors in the movie.
//if no movie, default is "Mr.Nobody" http://www.imdb.com/title/tt0485947/
function myMovie() {
	var request = require("request");
	var movieName = ""; 
		for(i = 3; i < process.argv.length; i++) {		
			if (i > 3 && process.argv.length ) {
				movieName += "+" + process.argv[i];
			} 

			// else if (process.argv[3] == null) {
			// 	movieName += "Mr.Nobody";
			// } 

			else {
				movieName += process.argv[i];
			}
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

}