// DOM selectors
const searchBtn = document.getElementById("search-form-btn");
const radioButtons = document.querySelectorAll('input[name="search-criteria"');
let infoSection = document.getElementById("info");
let recommendList = document.getElementById("related_artists");

// Each radio button
let radioArtist = radioButtons[0];
let radioAlbum = radioButtons[1];
let radioSong = radioButtons[2];

// When Search Button is clicked..
searchBtn.addEventListener("click", function (e) {
  // Test statement
  console.log("Inside searchBtn eventListener");

  // Clear the text fields in the modal
  infoSection.innerHTML = '';
  recommendList = '';

  // Get user input
  let searchInput = document.getElementById("search-form-input").value;

  // Artist selected
  if (radioArtist.checked == true) {
    findArtist(searchInput)
  }
  // Album selected
  if (radioAlbum.checked == true) {
    findAlbum(searchInput);
  }
  // Song selected
  if (radioSong.checked == true) {
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
      console.log(related_list);

      // Loop through fetched list and create <li> for each artist
      let recommendList = document.getElementById("related_artists");
      recommendList.innerHTML = "";

      for(var i = 0; i < related_list.length; i++) {
        let li = document.createElement("li");
        li.classList.add('collection-item')
        li.innerText = related_list[i].artist.artist_name;
        recommendList.appendChild(li);
      }
    });
}

function findArtist(artistName) {

  // Test statement
  console.log("Inside findArtist function");

  // Fetch API
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

function findAlbum(albumName) {
  // Test statement
  console.log("Inside findAlbum function");

  // Fetch API
  url = `https://ws.audioscrobbler.com/2.0/?method=album.search&album=${albumName}&api_key=7ab9cb11995319d63e18bb6fc861e53e&format=json`;
  let response = fetch(url);
  fetch(url)
    .then((response) => response.json())
    .then(data => {
      let info = document.createElement("span");
      info.innerText = data.results.albummatches.album[0].name + " by ";
      infoSection.appendChild(info);

      findArtist(data.results.albummatches.album[0].artist);
    })
}

function findSong(songName) {

  // Test statement
  console.log("Inside findSong function");

  // Fetch API
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

// Function to use modals. See https://materializecss.com/modals.html
document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('.modal');
  var instances = M.Modal.init(elems);
});