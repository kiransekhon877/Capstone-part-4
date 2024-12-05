const pokemonList = document.getElementById('pokemon-list');
const caughtPokemonList = document.getElementById('caught-pokemon-list');
const loadMoreButton = document.getElementById('load-more');
let offset = 0;
const limit = 20;

// Event listener for page load
document.addEventListener('DOMContentLoaded', () => {
    loadPokemon();
    loadCaughtPokemon();
});

// Event listener for Load More button click
loadMoreButton.addEventListener('click', () => {
    loadPokemon();
});

// Fetch and load the list of Pokémon from the API
async function loadPokemon() {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
    const data = await response.json();
    
    // Loop through Pokémon and display them
    data.results.forEach(pokemon => {
        displayPokemon(pokemon);
    });

    // Update the offset for the next fetch
    offset += limit;
}

// Display Pokémon card in the UI
function displayPokemon(pokemon) {
    const pokemonCard = document.createElement('div');
    pokemonCard.classList.add('col-md-3', 'pokemon-card');
    pokemonCard.innerHTML = `
        <div class="card mb-4">
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${extractIdFromUrl(pokemon.url)}.png" 
                class="card-img-top pokemon-img" alt="${pokemon.name}">
            <div class="card-body">
                <h5 class="card-title text-center">${capitalizeFirstLetter(pokemon.name)}</h5>
            </div>
        </div>
    `;
    
    // Add event listener for card click to load details
    pokemonCard.addEventListener('click', () => {
        loadPokemonDetails(pokemon.url);
    });
    
    pokemonList.appendChild(pokemonCard);
}

// Extract Pokémon ID from the API URL
function extractIdFromUrl(url) {
    const parts = url.split('/');
    return parts[parts.length - 2];
}

// Capitalize the first letter of a string
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Fetch detailed Pokémon data and display in a modal
async function loadPokemonDetails(url) {
    const response = await fetch(url);
    const pokemon = await response.json();
    
    const pokemonDetails = `
        <div class="modal" tabindex="-1" role="dialog">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">${capitalizeFirstLetter(pokemon.name)}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <img src="${pokemon.sprites.front_default}" class="img-fluid mb-3">
                        <p><strong>Height:</strong> ${pokemon.height}</p>
                        <p><strong>Weight:</strong> ${pokemon.weight}</p>
                        <p><strong>Base Experience:</strong> ${pokemon.base_experience}</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" id="catch-pokemon">Catch</button>
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Insert modal HTML into the page
    document.body.insertAdjacentHTML('beforeend', pokemonDetails);
    
    // Event listener to remove modal after it is closed
    document.querySelector('.modal').addEventListener('hidden.bs.modal', () => {
        document.querySelector('.modal').remove();
    });
    
    // Catch Pokémon when button is clicked
    document.getElementById('catch-pokemon').addEventListener('click', () => {
        catchPokemon(pokemon);
        document.querySelector('.modal').remove();
    });

    // Show the modal
    $('.modal').modal('show');
}

// Catch the Pokémon and store in localStorage
function catchPokemon(pokemon) {
    let caughtPokemon = JSON.parse(localStorage.getItem('caughtPokemon')) || [];
    
    // Avoid duplicates
    if (!caughtPokemon.some(p => p.id === pokemon.id)) {
        caughtPokemon.push({
            id: pokemon.id,
            name: pokemon.name,
            sprite: pokemon.sprites.front_default
        });
        localStorage.setItem('caughtPokemon', JSON.stringify(caughtPokemon));
        displayCaughtPokemon();
    }
}

// Load caught Pokémon from localStorage
function loadCaughtPokemon() {
    const caughtPokemon = JSON.parse(localStorage.getItem('caughtPokemon')) || [];
    caughtPokemon.forEach(pokemon => {
        displayCaughtPokemon(pokemon);
    });
}

// Display caught Pokémon in the UI
function displayCaughtPokemon(pokemon) {
    const pokemonCard = document.createElement('div');
    pokemonCard.classList.add}