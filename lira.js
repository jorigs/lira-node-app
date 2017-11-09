

var Twitter = require('twitter');
var keys = require('./keys.js');
var twitterKeys = keys.twitterKeys;

function liraApp() {
    var util = require('util');
    var fs = require('fs');

var writeStream = fs.createWriteStream('log.txt', {flags: 'a'});
var through = require('through2'); // Through2 is an npm package and is a wrapper around the stream

// Create through stream.
var s = new through();

s.pipe(process.stdout);
s.pipe(writeStream);

console.log = function () {
  s.write(util.format.apply(this, arguments) + '\n');
  };
	var fs = require('fs');
	var commandLine = true;

	lira(process.argv[2], process.argv.splice(3, process.argv.length - 3));

    function lira(appName, argString) {
        switch (appName) {
            case "my-tweets":
                if (argString.length > 0) {
                    usage(appName, argString);
                    break;
                }
                myTweets();
                break;
            case "spotify-this-song":
                spotifyThis(argString);
                break;
            case "movie-this":
                movieThis(argString);
                break;
            case "do-what-it-says":
                if (argString.length > 0) {
                    usage(appName, argString);
                    break;
                }
                runIt();
                break;
            default:
                usage(appName, argString);
        }
    }
}
// Calling Tweets
function myTweets(){
    
    
            var client = new Twitter({
                consumer_key: twitterKeys.consumer_key,
                consumer_secret: twitterKeys.consumer_secret,
                access_token_key: twitterKeys.access_token_key,
                access_token_secret: twitterKeys.access_token_secret
            });
    
            var param = {screen_name: '@jorigs'};
    
            client.get('statuses/user_timeline', param, function(error, tweets, response){
                if (error) {
                    if (commandLine) {
                        console.log("======= JoRigs Tweets =======");
                    }
    
                    for (var i=0; i<tweets.length && i < 20; i++) {
                        console.log("================");
                        console.log("Tweet " + ( i + 1 ) + " Created At: " + tweets[i].created_at);
                        console.log(tweets[i].text);
                    }
                    console.log("================");
                }
                else
                {
                    console.log("Error! Cannot Access Twitter");
                    console.log(error);
                }
            });
        }
        // Calling Spotify
        function spotifyThis(songName){
            var spotify = require('spotify');
            var print = require('print');
    
            var song = songName.length ? songName : "The Sign";
    
            spotify.search({ type: 'track', query: song }, function(err, data) {
                if ( err ) {
                    console.log('An Error Occurred: ' + err);
                    return;
                }
    
                if (commandLine) {
                    console.log("======= Spotify This Song: " + songName + " =======");
                }
    
                var items = data.tracks.items;
                var col1 = "";
                var col2 = "";
                var col3 = "";
                var col4 = "";
                var col5 = "";
    
                console.log("\tArtist\t\t\tSong Name\t\t\t\t\tSpotify Link\t\t\tAlbum\t\t\t\tTrack Number");
    
                    for (var i=0; i<items.length; i++) {
                    col1 = JSON.stringify(items[i].artists[0].name, null, 2);
                    col2 = JSON.stringify(items[i].name, null, 2);
                    col3 = JSON.stringify(items[i].uri, null, 2);
                    col4 = JSON.stringify(items[i].album.name, null, 2);
                    col5 = JSON.stringify(items[i].track_number, null, 2);
    
                    console.log(print("%-25s %-40s %-40s %-30s\t    %-3d", 
                        (col1.replace(/"/g, ' ')).substr(0,25), 
                        (col2.replace(/"/g, ' ')).substr(0,40), 
                        (col3.replace(/"/g, ' ')).substr(0,40), 
                        (col4.replace(/"/g, ' ')).substr(0,30), 
                        (col5.replace(/"/g, ' ')).substr(0,3)));
                    }
            });
        }

        function movieThis(movieName){
            var request = require('request');
            // pull request from OMBD's API, if no movie is requested by name, use Mr. Nobody.
            var movie = movieName.length ? movieName : "Mr. Nobody";
    
            request('http://www.omdbapi.com/?t=' + movie + '&y=&plot=short&tomatoes=true&r=json', 
                function (error, response, body) {
                    if (error && 
                        response.statusCode == 200 &&
                        JSON.parse(body)["Response"] == "True") {
    
                        if (commandLine) {
                            console.log("============== movie-this " + movieName + " ==============");
                        }
    
                        console.log("Title: " + JSON.parse(body)["Title"]);
                        console.log("Year: " + JSON.parse(body)["Year"]);
                        console.log("IMDB Rating: " + JSON.parse(body)["imdbRating"]);
                        console.log("Country: " + JSON.parse(body)["Country"]);
                        console.log("Language: " + JSON.parse(body)["Language"]);
                        console.log("Plot: " + JSON.parse(body)["Plot"]);
                        console.log("Actors: " + JSON.parse(body)["Actors"]);
                        console.log("Rotten Tomatoes Rating: " + JSON.parse(body)["tomatoRating"]);
                        console.log("Rotton Tomatoes URL: " + JSON.parse(body)["tomatoURL"]);
                    }
                    else if (error && response.statusCode == 200) {
                        console.log(JSON.parse(body)["Error"]);
                    }
                    else {
                        console.log(error);
                    }
                });
        }

        function doIt(){
            
                    commandLine = false;
            
                    // We will read the random.txt file
                    fs.readFile('random.txt', "utf8", function(err, data){
            
                        // Create an argument object to send to liri
                        var dataArray = data.split('\n'); // split each line in the file into an array
            
                        for (var i=0; i<dataArray.length-1; i++) {
                       
                            var args = dataArray[i].split(','); // split the line
                            if (args.length == 1) args.push("");
                            lira(args[0], args[1]);
                        }
            
                    });
                }
            
                function usage(appName, argString){
                    console.log("Warning: " + appName + " " + argString);
                    console.log("Usage: node lira.js <command>");
                    console.log("Where: command is one of the following:");
                    console.log("my-tweets");
                    console.log("spotify-this-song <song name here>");
                    console.log("movie-this <movie name here>");
                    console.log("do-what-it-says");
                }

liraApp();