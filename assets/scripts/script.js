// DOM selectors
const searchBtn = document.getElementById("search-form-btn");
const searchField = document.getElementById("search-form");
const radioButtons = document.querySelectorAll('input[name="search-criteria"');
let infoSection = document.getElementById("info");
let recommendList = document.getElementById("related_artists");
let searchHistoryArtist = JSON.parse(localStorage.getItem("artist")) || [];
let searchHistoryAlbum = JSON.parse(localStorage.getItem("album")) || [];
let searchHistorySong = JSON.parse(localStorage.getItem("song")) || [];

const searchHistoryArtistObject = {};
searchHistoryArtist.forEach(artist => {
  searchHistoryArtistObject[artist] = null
});

const searchHistoryAlbumObject = {};
searchHistoryAlbum.forEach(album => {
  searchHistoryAlbumObject[album] = null
});

const searchHistorySongObject = {};
searchHistorySong.forEach(song => {
  searchHistorySongObject[song] = null
});

let currentObj = searchHistoryArtistObject



// Each individual radio button
let radioArtist = radioButtons[0];
let radioAlbum = radioButtons[1];
let radioSong = radioButtons[2];

// When Radio Buttons are clicked
$(".with-gap").click(function() {

   // If artist is selected
   if (radioArtist.checked == true) {
    currentObj = searchHistoryArtistObject;
    autoCompleteChange();
  }

  // If album is selected
  if (radioAlbum.checked == true) {
    currentObj = searchHistoryAlbumObject;
    autoCompleteChange();
  }

  // If song is selected
  if (radioSong.checked == true) {
    currentObj = searchHistorySongObject;
    autoCompleteChange();
  }

  console.log(currentObj);
})

// When Search Button is clicked...
searchBtn.addEventListener("click", function (e) {
  // Test statement
  console.log("Inside searchBtn eventListener");

  // Clear the text fields in the modal
  infoSection.innerHTML = '';
  recommendList = '';

  // Get user input
  let searchInput = document.getElementById("search-form-input").value;

  // If artist is selected
  if (radioArtist.checked == true) {

    // Add it to searchHistory list, then refresh storage
    searchHistoryArtist.push(searchInput);
    //localStorage.removeItem("artist");
    localStorage.setItem("artist", JSON.stringify(searchHistoryArtist))
    searchHistoryArtistObject[searchInput]=null
    findArtist(searchInput)
  }

  // If album is selected
  if (radioAlbum.checked == true) {

    // Add it to searchHistory list, then refresh storage
    searchHistoryAlbum.push(searchInput);
    localStorage.removeItem("album");
    localStorage.setItem("album", JSON.stringify(searchHistoryAlbum))

    findAlbum(searchInput);
  }

  // If song is selected
  if (radioSong.checked == true) {

    // Add it to searchHistory list, then refresh storage
    searchHistorySong.push(searchInput);
    localStorage.removeItem("song");
    localStorage.setItem("song", JSON.stringify(searchHistorySong))

    findSong(searchInput);
  }
});

// Return related artist
function getRecommended(artist_id) {
  console.log("Inside getRecommended function");
  console.log(artist_id);

  // Fetch API
  url = `https://api.musixmatch.com/ws/1.1/artist.related.get?format=json&callback=callback&artist_id=${artist_id}&apikey=79b0066e9624b8ba0705fd55e8316a64`
  corsUrl = `https://cors-anywhere.herokuapp.com/${url}`;

  console.log(corsUrl);

  let response = fetch(corsUrl);
  fetch(corsUrl)
    .then((response) => response.json())
    .then(data => {
      let related_list = data.message.body.artist_list;

      // Test Message
      console.log(related_list);

      // Loop through fetched list and create a list entry for each recommendation
      let recommendList = document.getElementById("related_artists");
      recommendList.innerHTML = "";

      for(var i = 0; i < related_list.length; i++) {
        let link = document.createElement("a");
        link.classList.add('collection-item')
        link.innerText = related_list[i].artist.artist_name;
        link.setAttribute("id", related_list[i].artist.artist_name);
        getArtistURL(related_list[i].artist.artist_name)

        recommendList.appendChild(link);
      }
    });
}

// Function that returns the musixmatch API ID for the user's artist
function findArtist(artistName) {

  // Test statement
  console.log("Inside findArtist function");

  // Fetch for Musixmatch API. 
  // Note: corsURL is only used for local testing. Once deployed, we can use url.
  corsUrl = `https://cors-anywhere.herokuapp.com/https://api.musixmatch.com/ws/1.1/artist.search?format=json&callback=callback&q_artist=${artistName}&apikey=79b0066e9624b8ba0705fd55e8316a64`;
  url = `https://api.musixmatch.com/ws/1.1/artist.search?format=json&callback=callback&q_artist=${artistName}&apikey=79b0066e9624b8ba0705fd55e8316a64`;
  let response = fetch(corsUrl);
  fetch(corsUrl)
    .then((response) => response.json())
    .then(data => {
      // Display the name of the artist that was found
      let info = document.createElement("span");
      info.innerText = data.message.body.artist_list[0].artist.artist_name;
      infoSection.appendChild(info);

      getRecommended(data.message.body.artist_list[0].artist.artist_id)
    })
}

// Function that returns the name of the artist of the user's album.
function findAlbum(albumName) {

  // Test statement
  console.log("Inside findAlbum function");

  // Fetch for last.fm API
  url = `https://ws.audioscrobbler.com/2.0/?method=album.search&album=${albumName}&api_key=7ab9cb11995319d63e18bb6fc861e53e&format=json`;
  let response = fetch(url);
  fetch(url)
    .then((response) => response.json())
    .then(data => {
      let info = document.createElement("span");
      info.innerText = data.results.albummatches.album[0].name + " by ";
      infoSection.appendChild(info);
    
      // Send the name of the artist to findArtist() to get the musixmatch artist_id required for matchArtist()
      findArtist(data.results.albummatches.album[0].artist);
    })
}

// Function that returns the name of the artist of the user's song.
function findSong(songName) {

  // Test statement
  console.log("Inside findSong function");

  // Fetch for last.fm API
  url = `https://ws.audioscrobbler.com/2.0/?method=track.search&track=${songName}&api_key=7ab9cb11995319d63e18bb6fc861e53e&format=json`;
  let response = fetch(url);
  fetch(url)
    .then((response) => response.json())
    .then(data => {
      let info = document.createElement("span");
      info.innerText = data.results.trackmatches.track[0].name + " by ";
      infoSection.appendChild(info);

      findArtist(data.results.trackmatches.track[0].artist)
    })
}

// Function to get a URL for any artist based on Last.FM info
function getArtistURL(artistName) {
  // Test statement
  console.log("Inside getArtistURL");

  // Fetch API
  url = `https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${artistName}&api_key=7ab9cb11995319d63e18bb6fc861e53e&format=json`;
  let response = fetch(url);
  fetch(url)
    .then((response) => response.json())
    .then(data => {
      console.log(data.artist.url);
      document.getElementById(artistName).setAttribute("href", data.artist.url);
    })
}

// Function to use modals. See https://materializecss.com/modals.html
document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('.modal');
  var instances = M.Modal.init(elems);
});

// Function to use autocomplete. See https://materializecss.com/autocomplete.html
$(document).ready(function(){
  console.log(searchHistoryArtistObject);
  $('input.autocomplete').autocomplete({
    data: currentObj
  });
});

function autoCompleteChange() {
  $('input.autocomplete').autocomplete({
    data: currentObj
  });
}
      