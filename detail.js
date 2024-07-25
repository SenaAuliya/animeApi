document.addEventListener("DOMContentLoaded", () => {
  const animeDetailContainer = document.getElementById("anime-detail");
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const animeId = urlParams.get("id");

  fetch(`https://api.jikan.moe/v4/anime/${animeId}`)
    .then((response) => response.json())
    .then((data) => {
      const anime = data.data;
      animeDetailContainer.innerHTML = `
              <h1>${anime.title}</h1>
              <img src="${anime.images.jpg.image_url}" alt="${anime.title}">
              <p><strong>Synopsis:</strong> ${anime.synopsis}</p>
              <div>
              <p><strong>Episodes:</strong> ${anime.episodes}</p>
              <p><strong>Score:</strong> ${anime.score}</p>
              <p><strong>Genres:</strong> ${anime.genres
                .map((genre) => genre.name)
                .join(", ")}</p>
              </div>
              <a href="index.html">Back to List</a>
          `;
    })
    .catch((error) => {
      console.error("Error fetching anime detail:", error);
      animeDetailContainer.innerHTML = "<p>Failed to load anime details.</p>";
    });
});
