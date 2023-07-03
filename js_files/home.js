
const publicKey = '8a087aa703d5b492f2c6760e236b4569'; 
const privateKey = 'e9cd1a40676128eb71213f6775e39aa1d3d942b9'; 
const timestamp = new Date().getTime();
const hash = CryptoJS.MD5(timestamp + privateKey + publicKey).toString();


let superheroes = [];
// API URLs
const charactersURL = `https://gateway.marvel.com/v1/public/characters?ts=${timestamp}&apikey=${publicKey}&hash=${hash}`;

// Fetch superheroes from the API
async function fetchSuperheroes() {
  try {
    const response = await fetch(charactersURL);
    const data = await response.json();
    superheroes = data.data.results;
    return data.data.results;
  } catch (error) {
    console.log(error);
    return [];
  }
}

const searchInput = document.getElementById('search-input');
const superheroesList = document.getElementById('superhero');

// Event listeners
searchInput.addEventListener('input', searchSuperheroes);

// Display the list of superheroes
function displaySuperheroes(superheroes) {
  superheroesList.innerHTML = '';

  superheroes.forEach(superhero => {
    const li = createSuperheroElement(superhero);
    console.log("li",li)
    superheroesList.appendChild(li);
  });
}

// Create a superhero list item
function createSuperheroElement(superhero) {
  const { name, thumbnail } = superhero;
  const li = document.createElement('li');
  const div = document.createElement('div')
  const img = document.createElement('img');
  const superheroName = document.createElement('h3');
  const anchor = document.createElement('a');
  img.src = `${thumbnail.path}/portrait_incredible.${thumbnail.extension}`
  img.alt = name;
  li.appendChild(div)
  div.appendChild(img);
  superheroName.textContent = name;
  div.appendChild(superheroName);
  const favoriteBtn = createFavoriteButton(superhero);
  li.appendChild(favoriteBtn);
  anchor.href = `super_hero.html?id=${superhero.id}`;
  anchor.innerText = "More Info";
  li.appendChild(anchor);
  return li;
}

//Create favorite button for each superhero
function createFavoriteButton(superhero) {
  const favoriteBtn = document.createElement('button');
  favoriteBtn.textContent = 'Add to Favorites';

  favoriteBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    addFavoriteSuperhero(superhero.id);
  });

  return favoriteBtn;
}
// add favorite superheroes to local storage
function addFavoriteSuperhero(superheroId) {
  const favorites = getFavoriteSuperheroes();
  if (!favorites.includes(superheroId)) {
    favorites.push(superheroId);
    alert("Successfully Added to Favourites");
    saveFavoriteSuperheroes(favorites);
  }else{
    alert(" Already Added to Favourites");
  }

}
// Get the list of favorite superheroes
function getFavoriteSuperheroes() {
  const favoritesJSON = localStorage.getItem('favoriteSuperheroes');
  if (favoritesJSON) {
    return JSON.parse(favoritesJSON);
  } else {
    return [];
  }
}
// Save the list of favorite superheroes to local storage
function saveFavoriteSuperheroes(favorites) {
  const favoritesJSON = JSON.stringify(favorites);
  localStorage.setItem('favoriteSuperheroes', favoritesJSON);
}

// Search superheroes based on input query
function searchSuperheroes() {
  const query = searchInput.value.toLowerCase();
  const filteredSuperheroes = superheroes.filter(superhero => superhero.name.toLowerCase().includes(query));
  displaySuperheroes(filteredSuperheroes);
}

// Fetch and display superheroes on the home page
async function loadSuperheroes() {
  const superheroes = await fetchSuperheroes();
  console.log("superheroes",superheroes);
  displaySuperheroes(superheroes);
}

loadSuperheroes();
