
const API_KEY = 'AIzaSyCq65PWPmxHiQLgCibDsXNUkLmgSwUj-4c';

const CHANNEL_ID = 'UCvNVqsaEd-TourvOQKuCNjQ';

async function fetchTopVideos() {
  const videoContainer = document.getElementById("video-grid");
  videoContainer.innerHTML = '<p>Cargando videos...</p>';

  try {
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
   } catch (err) {
      console.error('Error cargando videos:', err);
      videoContainer.innerHTML = `
        <div style="text-align: center; padding: 20px;">
          <p>No se pudieron cargar los videos del canal.</p>
          <p>Puedes ver los videos directamente en el canal de YouTube:</p>
          <a href="https://www.youtube.com/@hoopp4510" target="_blank">Ver Canal de YouTube</a>
        </div>
      `;
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
