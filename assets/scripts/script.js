// DOM selectors
const searchBtn = document.getElementById("search-form-btn");
const radioButtons = document.querySelectorAll('input[name="search-criteria"');
// Each radio button
let radioArtist = radioButtons[0];
let radioAlbum = radioButtons[1];
let radioSong = radioButtons[2];
// When Search Button is clicked..
searchBtn.addEventListener("click", function (e) {
  e.preventDefault();

  // Test statement
  console.log("Inside searchBtn eventListener");

  // Get user input
  let searchInput = document.getElementById("search-form-input").value;

  // Artist selected
  if (radioArtist.checked == true) {
    findArtist(searchInput);
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
function matchArtist(artist_id) {
  console.log("Inside matchArtist function");
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
      let list = document.getElementById("related_artists");
      list.innerHTML = "";

      for(var i = 0; i < related_list.length; i++) {
        let li = document.createElement("li");
        li.innerText = related_list[i].artist.artist_name;
        list.appendChild(li);
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
    .then(data => matchArtist(data.message.body.artist_list[0].artist.artist_id))
}

function findAlbum(albumName) {
  // Test statement
  console.log("Inside findAlbum function");
  // Fetch API
  url = `https://ws.audioscrobbler.com/2.0/?method=album.search&album=${albumName}&api_key=7ab9cb11995319d63e18bb6fc861e53e&format=json`;
  let response = fetch(url);
  fetch(url)
    .then((response) => response.json())
    .then(data => findArtist(data.results.albummatches.album[0].artist))
}

function findSong(songName) {
  // Test statement
  console.log("Inside findSong function");
  // Fetch API
  url = `https://ws.audioscrobbler.com/2.0/?method=track.search&track=${songName}&api_key=7ab9cb11995319d63e18bb6fc861e53e&format=json`;
  let response = fetch(url);
  fetch(url)
    .then((response) => response.json())
    .then(data => findArtist(data.results.trackmatches.track[0].artist))
}