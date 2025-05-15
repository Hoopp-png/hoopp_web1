const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;


app.use(express.json());

app.use(express.static('public'));

// Ruta para obtener puntajes guardados
app.get('/api/scores', (req, res) => {
  const filePath = path.join(__dirname, 'json', 'scores.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) return res.json([]);
    try {
      const scores = JSON.parse(data);
      res.json(scores);
    } catch {
      res.json([]);
    }
  });
});

// Ruta para guardar puntajes
app.post('/api/scores', (req, res) => {
  const { name, score } = req.body;
  if (!name || typeof score !== 'number') {
    return res.status(400).json({ error: 'Datos inválidos' });
  }

  const filePath = path.join(__dirname, 'json', 'scores.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    let scores = [];
    if (!err) {
      try {
        scores = JSON.parse(data);
      } catch {}
    }
    scores.push({ name, score });
    scores.sort((a, b) => b.score - a.score);
    scores = scores.slice(0, 10); // Guardar solo top 10

    fs.writeFile(filePath, JSON.stringify(scores, null, 2), (err) => {
      if (err) return res.status(500).json({ error: 'No se pudo guardar' });
      res.json({ message: 'Puntaje guardado' });
    });
  });
});

// Ruta para obtener sugerencias guardadas
app.get('/api/suggestions', (req, res) => {
  const filePath = path.join(__dirname, 'json', 'suggestions.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) return res.json([]);
    try {
      const suggestions = JSON.parse(data);
      res.json(suggestions);
    } catch {
      res.json([]);
    }
  });
});

// Ruta para guardar sugerencias
app.post('/api/suggestions', (req, res) => {
  const { text } = req.body;
  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Texto inválido' });
  }

  const filePath = path.join(__dirname, 'json', 'suggestions.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    let suggestions = [];
    if (!err) {
      try {
        suggestions = JSON.parse(data);
      } catch {}
    }
    suggestions.push({ text, date: new Date().toISOString() });

    fs.writeFile(filePath, JSON.stringify(suggestions, null, 2), (err) => {
      if (err) return res.status(500).json({ error: 'No se pudo guardar' });
      res.json({ message: 'Sugerencia guardada' });
    });
  });
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en http://0.0.0.0:${PORT}`);
});