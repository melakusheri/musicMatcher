// DOM selectors
const searchBtn = document.getElementById("search-form-btn");
const radioButtons = document.querySelectorAll('input[name="search-criteria"');
// Each radio button
let radioArtist = radioButtons[0];
let radioAlbum = radioButtons[1];
let radioSong = radioButtons[2];
// When Search Button is clicked..
searchBtn.addEventListener("click", function () {
  event.preventDefault();
  // Test statement
  console.log("Inside searchBtn eventListener");
  // Get user input
  let searchInput = document.getElementById("search-form-input").value;
  // Artist selected
  if (radioArtist.checked == true) {
    matchArtist(searchInput);
  }
  // Album selected
  if (radioAlbum.checked == true) {
    matchAlbum(searchInput);
  }
  // Song selected
  if (radioSong.checked == true) {
    matchSong(searchInput);
  }
});
// Return related artist
function matchArtist(artistName) {
  findArtist(artistName);
}
function findArtist(artistName) {
  // Test statement
  console.log("Inside matchArtist function");
  // Fetch API
  corsUrl = `https://cors-anywhere.herokuapp.com/https://api.musixmatch.com/ws/1.1/artist.search?format=json&callback=callback&q_artist=${artistName}&apikey=79b0066e9624b8ba0705fd55e8316a64`;
  url = `https://api.musixmatch.com/ws/1.1/artist.search?format=json&callback=callback&q_artist=${artistName}&apikey=79b0066e9624b8ba0705fd55e8316a64`;
  let response = fetch(url);
  fetch(url)
    .then((response) => response.json())
    .then((data) => console.log(data));
  fetch(corsUrl)
    .then((response) => response.json())
    .then((data) => console.log(data));
}
