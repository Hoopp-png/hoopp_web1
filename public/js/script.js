document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('suggestion-form');
  const suggestionList = document.getElementById('suggestion-list');
  const suggestionText = document.getElementById('suggestion-text');

  const API_URL = 'https://hoopp-web1.onrender.com/api/suggestions';

  function displaySuggestions(suggestions) {
    suggestionList.innerHTML = '';
    suggestions.forEach(suggestion => {
      const li = document.createElement('li');
      li.textContent = suggestion.text + (suggestion.date ? ` (enviado el ${new Date(suggestion.date).toLocaleDateString()})` : '');
      suggestionList.appendChild(li);
    });
  }

  fetch(API_URL)
    .then(res => {
      if (!res.ok) throw new Error('Error HTTP ' + res.status);
      return res.json();
    })
    .then(data => {
      console.log('Sugerencias recibidas:', data);
      displaySuggestions(data);
    })
    .catch(err => {
      console.error('Error en fetch inicial:', err);
      alert('Error de conexión: ' + err.message);
    });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = suggestionText.value.trim();
    if (!text) return alert('Por favor escribe una sugerencia.');

    const wordCount = text.split(/\s+/).length;
    if (wordCount > 500) {
      alert("Máximo 500 palabras por sugerencia. Te amo.");
      return;
    }

    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    })
      .then(res => {
        if (!res.ok) throw new Error('Error HTTP ' + res.status);
        return res.json();
      })
      .then(data => {
        if (data.error) {
          alert('Error al guardar sugerencia');
          return;
        }
        suggestionText.value = '';

        return fetch(API_URL);
      })
      .then(res => {
        if (!res.ok) throw new Error('Error HTTP ' + res.status);
        return res.json();
      })
      .then(data => displaySuggestions(data))
      .catch(err => {
        console.error('Error en fetch posterior:', err);
        alert('Error de conexión al enviar o recargar sugerencias: ' + err.message);
      });
  });
});

//para los videos 
const API_KEY = 'AIzaSyCq65PWPmxHiQLgCibDsXNUkLmgSwUj-4c';
const CHANNEL_ID = 'UCvNVqsaEd-TourvOQKuCNjQ';

async function fetchTopVideos() {
  const videoContainer = document.getElementById("video-grid");
  videoContainer.innerHTML = '<p>Cargando videos...</p>';

  // Sin try-catch
  const resChannel = await fetch(
    `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${CHANNEL_ID}&key=${API_KEY}`
  );
  const dataChannel = await resChannel.json();
  const uploadsPlaylistId =
    dataChannel.items[0].contentDetails.relatedPlaylists.uploads;

  const resVideos = await fetch(
    `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=12&key=${API_KEY}`
  );
  const dataVideos = await resVideos.json();

  videoContainer.innerHTML = '';

  const carouselButtons = document.createElement('div');
  carouselButtons.className = 'carousel-buttons';
  carouselButtons.innerHTML = `
    <button class="carousel-btn" onclick="prevPage()">&lt;</button>
    <button class="carousel-btn" onclick="nextPage()">&gt;</button>
  `;
  videoContainer.parentElement.insertBefore(carouselButtons, videoContainer.nextSibling);

  const videos = dataVideos.items;
  const pages = Math.ceil(videos.length / 2);

  for (let i = 0; i < pages; i++) {
    const page = document.createElement('div');
    page.className = `video-page ${i === 0 ? '' : 'hidden'}`;
    page.dataset.page = i;

    const pageVideos = videos.slice(i * 2, (i + 1) * 2);
    pageVideos.forEach(item => {
      const videoId = item.snippet.resourceId.videoId;
      const iframe = document.createElement("iframe");
      iframe.src = `https://www.youtube.com/embed/${videoId}`;
      iframe.allowFullscreen = true;
      page.appendChild(iframe);
    });

    videoContainer.appendChild(page);
  }
}

window.addEventListener("DOMContentLoaded", () => {
  fetchTopVideos();
});

let currentPage = 0;
const totalPages = Math.ceil(12 / 2);

function showPage(pageNum) {
  const pages = document.querySelectorAll('.video-page');
  pages.forEach(page => {
    if (parseInt(page.dataset.page) === pageNum) {
      page.classList.remove('hidden');
    } else {
      page.classList.add('hidden');
    }
  });
}

function nextPage() {
  currentPage = (currentPage + 1) % totalPages;
  showPage(currentPage);
}

function prevPage() {
  currentPage = (currentPage - 1 + totalPages) % totalPages;
  showPage(currentPage);
}

