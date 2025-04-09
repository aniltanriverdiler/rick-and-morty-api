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
  <img src="${character.image}" class="card-img-top" alt="...">
  <div class="card-body d-flex flex-column">
    <h5 class="card-title">${character.name}</h5>
    <p class="card-text">${character.status}</p>
    <p class="card-text">${character.location.name}</p>
    <p class="card-text">${character.species}</p>
    <a href="#" class="btn btn-primary">Go somewhere</a>
  </div>
  </div>
  `;

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
