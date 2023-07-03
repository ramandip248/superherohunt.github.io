const publicKey = '8a087aa703d5b492f2c6760e236b4569'; 
const privateKey = 'e9cd1a40676128eb71213f6775e39aa1d3d942b9'; 
const timestamp = new Date().getTime();
const hash = CryptoJS.MD5(timestamp + privateKey + publicKey).toString();



// Fetch superheroes from the API
async function fetchSuperheroDetails(superheroId) {
    const detailsURL = `https://gateway.marvel.com/v1/public/characters/${superheroId}?ts=${timestamp}&apikey=${publicKey}&hash=${hash}`;
  try {
    const response = await fetch(detailsURL);
    const data = await response.json();
    superheroes = data.data.results;
    return data.data.results;
  } catch (error) {
    console.log(error);
    return [];
  }
}

// DOM elements
const superheroDetails = document.getElementById('superhero-details');

// Get the superhero ID from the URL parameter (assuming it's passed as "?id=...")
const urlParams = new URLSearchParams(window.location.search);
const superheroId = urlParams.get('id');
console.log("superheroId",superheroId)

// Display superhero details
function displaySuperheroDetails(superhero) {
  const { name, thumbnail, description, comics, events, series, stories } = superhero[0];

  superheroDetails.innerHTML = `
    <h3>${name}</h3>
    <div id="image-container">
       <img src="${thumbnail.path}.${thumbnail.extension}" alt="${name}">
    </div>
    <p>${description || 'No description available.'}</p>
    <div id="detail">
    <div class="detail-item">
    <h4>Comics</h4>
    <ul>${comics.items.map(comic => `<li>${comic.name}</li>`).join('')}</ul>
    </div>
    <div class="detail-item">
    <h4>Events</h4>
    <ul>${events.items.map(event => `<li>${event.name}</li>`).join('')||'No Events available'}</ul>
    </div>
    <div class="detail-item">
    <h4>Series</h4>
    <ul>${series.items.map(series => `<li>${series.name}</li>`).join('')}</ul>
    </div>
    <div class="detail-item">
    <h4>Stories</h4>
    <ul>${stories.items.map(story => `<li>${story.name}</li>`).join('')}</ul>
    </div>
    </div>
  `;
}

// Fetch and display superhero details
async function loadSuperhero() {
  const superhero = await fetchSuperheroDetails(superheroId);
  console.log(superhero);
  displaySuperheroDetails(superhero);
}

loadSuperhero();