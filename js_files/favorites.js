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

const favoritesList = document.getElementById('favorites-list');

// Get favorite superheroes from local storage
function getFavoriteSuperheroes() {
    const favoritesJSON = localStorage.getItem('favoriteSuperheroes');
    if (favoritesJSON) {
        console.log("favoritesJSON",favoritesJSON);
      return JSON.parse(favoritesJSON);
    } else {
      return [];
    }
  }


// Display favorite superheroes
function displayFavorites(favorites) {
    favoritesList.innerHTML = '';
  
    if (favorites.length === 0) {
      favoritesList.innerHTML = '<p>No favorite superheroes.</p>';
      return;
    }
  
    favorites.forEach(superheroId => {
      fetchSuperheroDetails(superheroId)
        .then(superhero => {
          const li = createFavoriteSuperheroElement(superhero);
          favoritesList.appendChild(li);
        })
        .catch(error => {
          console.log(error);
        });
    });
  }

// Create a favorite superhero list item
function createFavoriteSuperheroElement(superhero) {
  const { id, name,thumbnail } = superhero[0];
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
  
  const removeBtn = createRemoveButton(id);
  li.appendChild(removeBtn);
  anchor.href = `super_hero.html?id=${id}`;
  anchor.innerText = "More Info";
  li.appendChild(anchor);

  return li;
}

// Create remove button for a favorite superhero
function createRemoveButton(superheroId) {
  const button = document.createElement('button');
  button.textContent = 'Remove from Favorites';
  button.addEventListener('click', () => {
    removeFavoriteSuperhero(superheroId);
  });
  return button;
}

// Remove a superhero from favorites
function removeFavoriteSuperhero(superheroId) {
    const favorites = getFavoriteSuperheroes();
    console.log("favorites",favorites)
    const updatedFavorites = favorites.filter(id => id !== superheroId);
    console.log("updatedFavorites",updatedFavorites)
    saveFavoriteSuperheroes(updatedFavorites);
    displayFavorites(updatedFavorites);
  }
  
// Save favorite superheroes to local storage
  function saveFavoriteSuperheroes(favorites) {
    const favoritesJSON = JSON.stringify(favorites);
    localStorage.setItem('favoriteSuperheroes', favoritesJSON);
   
  }
// Load favorite superheroes
function loadFavorites() {
  const favorites = getFavoriteSuperheroes();
  displayFavorites(favorites);
}

loadFavorites();