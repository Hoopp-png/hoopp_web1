document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('suggestion-form');
  const suggestionList = document.getElementById('suggestion-list');
  const suggestionText = document.getElementById('suggestion-text');

  const API_URL = 'https://hoopp-web1.onrender.com/sugerencias.html/api/suggestions';

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




