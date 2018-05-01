require("dotenv").config();
var keys = require("./keys.js");
var fs = require("fs");
var request = require("request");
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);
// console.log(client);
var params = {count:20};
var inputOne = process.argv[2];
var inputTwo = process.argv[3];

// Make it so liri.js can take in one of the following commands:
// * `my-tweets`
function getTweets(){
  client.get('statuses/user_timeline', params, function(error, tweets, response){
       if (!error){
            for (var i = 0; i < tweets.length; i++){
                 console.log(tweets[i].text + " Created on: " + tweets[i].created_at);
            }
       } else{
            console.log(error);
       }
  });
}

// * `spotify-this-song`
function getSong(){
  var queryInput = "The Sign";
  if (inputTwo !== undefined){
       queryInput = inputTwo;
  }
  spotify.search({ type: 'track', query: queryInput}, function(err, data){
      if ( err ){
          console.log('Error occurred: ' + err);
          return;
      }
      console.log("Artist: " + data.tracks.items[0].artists[0].name);
      console.log("Song Name: " + data.tracks.items[0].name);
      console.log("Spotify Preview Link: " + data.tracks.items[0].external_urls.spotify);
      console.log("Album: " + data.tracks.items[0].album.name);
  });
}

// * `movie-this`
function getMovie(){
  var queryInput = "Mr. Nobody";
  if (inputTwo !== undefined){
       queryInput = inputTwo;
  }
  request('http://www.omdbapi.com/?apikey=trilogy&t=' + queryInput + "&tomatoes=true", function (error, response, body) {
       if (!error && response.statusCode == 200){
            var movieData = JSON.parse(body);
            console.log("Title: " + movieData.Title);
            console.log("Year: " + movieData.Year);
            console.log("IMDB Rating: " + movieData.imdbRating);
            console.log("Rotten Tomatoes Rating: " + movieData.tomatoUserRating);
            console.log("Country: " + movieData.Country);
            console.log("Language: " + movieData.Language);
            console.log("Plot: " + movieData.Plot);
            console.log("Actors: " + movieData.Actors);
       }
       else{
            console.log(error);
       }
  });
}

// * `do-what-it-says`
function getRandom(){
  fs.readFile("random.txt", "utf8", function(error, data){
    if(error){
      console.log(error);
    }
      else{
        var dataArray = data.split(',');
        inputOne = dataArray[0];
        // console.log(inputOne);
        inputTwo = dataArray[1];
        // console.log(inputTwo);
        function getSong(){
          spotify.search({ type: 'track', query: inputTwo, count: 1 }, function(err, data){
          if ( err ){
            console.log('Error occurred: ' + err);
          return;
          }
          console.log("Artist: " + data.tracks.items[0].artists[0].name);
          console.log("Song Name: " + data.tracks.items[0].name);
          console.log("Spotify Preview Link: " + data.tracks.items[0].external_urls.spotify);
          console.log("Album: " + data.tracks.items[0].album.name);
          fs.appendFile('log.txt', "Artist: " + data.tracks.items[0].artists[0].name + "\n" + "Song Name: " + data.tracks.items[0].name + "\n" + "Spotify Preview Link: " + data.tracks.items[0].external_urls.spotify + "\n" + "Album: " + data.tracks.items[0].album.name + "\n" + "=================================================================");
          });
        }
        getSong();
      }
  })
};

// calling individual functions based on process.argv[2]
switch(inputOne){
  case "my-tweets":
       getTweets();
       break;
  case "spotify-this-song":
       getSong();
       break;
  case "movie-this":
       getMovie();
       break;
  case "do-what-it-says":
       getRandom();
       break;
}
