const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
const axios = require('axios'); 

const MONGO_URI = "";

const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(express.static('public'));

const client = new MongoClient(MONGO_URI, {
  tls: true,
  tlsAllowInvalidCertificates: false,
});

let db;


const DISCORD_WEBHOOK_URL = '';

client.connect()
  .then(() => {
    db = client.db("kozato");
    console.log('✅ Conectado a MongoDB Atlas');

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Servidor corriendo en http://0.0.0.0:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Error conectando a MongoDB:', err);
  });


// Ruta para obtener sugerencias
app.get('/api/suggestions', async (req, res) => {
  try {
    const suggestions = await db.collection('suggestions').find().toArray();
    res.json(suggestions);
  } catch (err) {
    console.error('Error al obtener sugerencias:', err);
    res.status(500).json([]);
  }
});

// Ruta para guardar sugerencias y enviarlas a Discord
app.post('/api/suggestions', async (req, res) => {
  const { text } = req.body;
  if (!text || typeof text !== 'string') return res.status(400).json({ error: 'Texto inválido' });

  try {
    // Guardar en MongoDB
    await db.collection('suggestions').insertOne({ text, date: new Date().toISOString() });

    // Enviar al canal de Discord
    await axios.post(DISCORD_WEBHOOK_URL, {
      content: `📨 Nueva sugerencia recibida:\n${text}`
    });

    res.json({ message: 'Sugerencia guardada y enviada a Discord' });
  } catch (err) {
    console.error('❌ Error al guardar o enviar sugerencia:', err);
    res.status(500).json({ error: 'No se pudo guardar o enviar la sugerencia' });
  }
});
