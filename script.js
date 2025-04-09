const container = document.getElementById("characterContainer");
const searchInput = document.getElementById("searchInput");
const loading = document.getElementById("loading");

let currentPage = 1;
let isFetching = false;
let searchQuery = "";

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

const createCharacterCard = (character) => {
  const col = document.createElement("div");
  col.className = "col-md-4 col-lg-3";

  col.innerHTML = `
    <div class="card h-100">
      <img src="${character.image}" class="card-img-top" alt="${character.name}">
      <div class="card-body d-flex flex-column">
        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#characterModal">
          Show Details
        </button>
      </div>
    </div>
  `;

  const detailsButton = col.querySelector("button"); 

  detailsButton.addEventListener("click", () => {
    const modalBody = document.querySelector(".modal-body");
    const modalTitle = document.querySelector(".modal-title");

    modalTitle.textContent = character.name;

    modalBody.innerHTML = `
      <img src="${character.image}" class="img-fluid mb-3" />
      <p><strong>Status:</strong> ${character.status}</p>
      <p><strong>Species:</strong> ${character.species}</p>
      <p><strong>Gender:</strong> ${character.gender}</p>
      <p><strong>Location:</strong> ${character.location.name}</p>
      <p><strong>Episode Count:</strong> ${character.episode.length}</p>
    `;
  });

  container.appendChild(col); 
};

searchInput.addEventListener("input", () => {
  container.innerHTML = "";
  searchQuery = searchInput.value;
  currentPage = 1;
  fetchCharacters(currentPage, searchQuery);
});

window.addEventListener("scroll", () => {
  if (
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 &&
    !isFetching
  ) {
    currentPage++;
    fetchCharacters(currentPage, searchQuery);
  }
});

fetchCharacters();

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
