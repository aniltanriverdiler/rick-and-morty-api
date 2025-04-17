const container = document.getElementById("characterContainer");
const searchInput = document.getElementById("searchInput");
const loading = document.getElementById("loading");
const showFavoritesBtn = document.getElementById("showFavoritesBtn");

let currentPage = "1";
let currentView = "home";
let isFetching = false;
let searchQuery = "";

// Get API
const fetchCharacters = async (page = 1, name = "") => {
  isFetching = true;
  loading.style.display = "block";

  try {
    const response = await fetch(
      `https://rickandmortyapi.com/api/character/?page=${page}&name=${name}`
    );
    const data = await response.json();
    console.log(data);
    data.results.forEach(createCharacterCard);
  } catch (error) {
    console.error("Hata: ", error);
  }

  loading.style.display = "none";
  isFetching = false;
};

// Show Favorite Card
const showFavoriteCharacters = () => {
  // Clear existing content
  container.innerHTML = "";

  // Get favorite character IDs
  const favorites = getFavorites();

  // If no favorites, show a message
  if (favorites.length === 0) {
    container.innerHTML =
      "<p class='text-center mt-4 fav-text'>No favorites added yet.</p>";
    return;
  }

  // Fetch all favorite character data
  favorites.forEach(async (id) => {
    try {
      const response = await fetch(
        `https://rickandmortyapi.com/api/character/${id}`
      );
      const data = await response.json();
      createCharacterCard(data);
    } catch (error) {
      console.error("Error fetching favorite character:", error);
    }
  });
};

// Create Character Card
const createCharacterCard = (character) => {
  const col = document.createElement("div");
  col.className = "col-md-4 col-lg-3 mb-1";

  col.innerHTML = `
    <div class="card">
      <img src="${character.image}" class="card-img-top" alt="${character.name}">
      <div class="card-body d-flex flex-column">
        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#characterModal">
          Show Details
        </button>
      </div>
    </div>
  `;

  // Details Button
  const detailsButton = col.querySelector("button");

  detailsButton.addEventListener("click", () => {
    const modalBody = document.querySelector(".modal-body");
    const modalTitle = document.querySelector(".modal-title");

    modalTitle.textContent = character.name;

    modalBody.innerHTML = `
      <img src="${character.image}" class="img-fluid mb-3"/>
      <p>Status: ${character.status}</p>
      <p>Species: ${character.species}</p>
      <p>Gender: ${character.gender}</p>
      <p>Location: ${character.location.name}</p>
      <p>Episode Count: ${character.episode.length}</p>
      <button id="favoriteBtn" class="btn btn-outline-warning">
       ${
         isFavorite(character.id)
           ? "★ Remove from Favorites"
           : "☆ Add to Favorites"
       } 
      </button>
    `;

    // Favorite Button
    const favoriteBtn = document.getElementById("favoriteBtn");
    favoriteBtn.addEventListener("click", () => {
      toggleFavorite(character.id);
      favoriteBtn.textContent = isFavorite(character.id)
        ? "★ Remove from Favorites"
        : "☆ Add to Favorites";
    });

    // Show All Button
    const showAllBtn = document.getElementById("showAllBtn");
    showAllBtn.addEventListener("click", () => {
      container.innerHTML = "";
      currentPage = 1;
      currentView = "home";
      fetchCharacters(currentPage);
    });
  });

  container.appendChild(col);
};

// Debounce Section
let debounceTimer;

searchInput.addEventListener("input", () => {
  clearTimeout(debounceTimer);

  debounceTimer = setTimeout(() => {
    container.innerHTML = "";
    searchQuery = searchInput.value;
    currentPage = 1;
    fetchCharacters(currentPage, searchQuery);
  }, 500);
});

// Infinite Scroll
const handleInfinityScroll = () => {
  if (currentView !== "home" || isFetching) return;

  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
    currentPage++;
    fetchCharacters(currentPage, searchQuery);
  }
};

fetchCharacters();

window.addEventListener("scroll", handleInfinityScroll);

// Favorites will be stored in localStorage
const getFavorites = () => {
  return JSON.parse(localStorage.getItem("favorites")) || [];
};

const isFavorite = (id) => {
  const favorites = getFavorites();
  return favorites.includes(id);
};

const toggleFavorite = (id) => {
  let favorites = getFavorites();
  if (favorites.includes(id)) {
    favorites = favorites.filter((favId) => favId !== id);
  } else {
    favorites.push(id);
  }
  localStorage.setItem("favorites", JSON.stringify(favorites));
};

// Show Get Favorites Characters
showFavoritesBtn.addEventListener("click", () => {
  currentView = "favorites";
  showFavoriteCharacters();
});
