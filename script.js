document.addEventListener('DOMContentLoaded', function() {
  const searchForm = document.getElementById('search-form');
  const searchInput = document.getElementById('search');
  const genreSelect = document.getElementById('genre-select');
  const animeListDiv = document.getElementById('anime-list');
  const paginationDiv = document.getElementById('pagination');
  const loadingDiv = document.getElementById('loading');

  let currentPage = 1;
  const pageSize = 16; 
  let totalPages = 1;

  function showLoading() {
    loadingDiv.style.display = 'block';
  }

  function hideLoading() {
    loadingDiv.style.display = 'none';
  }

  function fetchAnimeList(url) {
    showLoading();
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        animeListDiv.innerHTML = '';
        totalPages = Math.ceil(data.pagination.items.total / pageSize);
        data.data.forEach(anime => {
          const animeLink = document.createElement('a');
          animeLink.href = `anime.html?id=${anime.mal_id}`;
          animeLink.classList.add('anime-item');

          const animeImage = document.createElement('img');
          animeImage.src = anime.images.jpg.image_url;
          animeImage.alt = anime.title;

          const animeTitle = document.createElement('h2');
          animeTitle.textContent = anime.title;

          const animeScore = document.createElement('p');
          animeScore.textContent = `Score: ${anime.score}`;

          animeLink.appendChild(animeImage);
          animeLink.appendChild(animeTitle);
          animeLink.appendChild(animeScore);
          animeListDiv.appendChild(animeLink);
        });

        updatePagination();
        hideLoading();
      })
      .catch(error => {
        console.error('Error fetching anime information:', error);
        hideLoading();
      });
  }

  function updatePagination() {
    paginationDiv.innerHTML = '';

    if (currentPage > 1) {
      const prevButton = document.createElement('button');
      prevButton.textContent = 'Previous';
      prevButton.addEventListener('click', () => {
        currentPage--;
        loadPage();
      });
      paginationDiv.appendChild(prevButton);
    } else {
      const prevButton = document.createElement('button');
      prevButton.textContent = 'Previous';
      prevButton.classList.add('disabled');
      paginationDiv.appendChild(prevButton);
    }

    const startPage = Math.max(1, currentPage - Math.floor(5 / 2));
    const endPage = Math.min(totalPages, currentPage + Math.floor(5 / 2));

    for (let i = startPage; i <= endPage; i++) {
      const pageButton = document.createElement('button');
      pageButton.textContent = i;
      if (i === currentPage) {
        pageButton.classList.add('disabled');
      } else {
        pageButton.addEventListener('click', () => {
          currentPage = i;
          loadPage();
        });
      }
      paginationDiv.appendChild(pageButton);
    }

    if (currentPage < totalPages) {
      const nextButton = document.createElement('button');
      nextButton.textContent = 'Next';
      nextButton.addEventListener('click', () => {
        currentPage++;
        loadPage();
      });
      paginationDiv.appendChild(nextButton);
    } else {
      const nextButton = document.createElement('button');
      nextButton.textContent = 'Next';
      nextButton.classList.add('disabled');
      paginationDiv.appendChild(nextButton);
    }
  }

  function loadPage() {
    const searchTerm = searchInput.value.trim();
    const genre = genreSelect.value;
    let searchUrl = `https://api.jikan.moe/v4/top/anime?page=${currentPage}&limit=${pageSize}`;
    if (searchTerm) {
      searchUrl = `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(searchTerm)}&page=${currentPage}&limit=${pageSize}`;
    } else if (genre) {
      searchUrl = `https://api.jikan.moe/v4/anime?genres=${genre}&page=${currentPage}&limit=${pageSize}`;
    }
    fetchAnimeList(searchUrl);
  }

  searchForm.addEventListener('submit', function(event) {
    event.preventDefault();
    currentPage = 1;
    loadPage();
  });

  loadPage();
});
