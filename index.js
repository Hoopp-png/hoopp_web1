const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');

const MONGO_URI = "mongodb+srv://kozato:waza777@kozato.tyukxmb.mongodb.net/?retryWrites=true&w=majority";
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(express.static('public'));

const client = new MongoClient(MONGO_URI, {
  tls: true,
  tlsAllowInvalidCertificates: false,
});

let db;


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

// Ruta para guardar sugerencias
app.post('/api/suggestions', async (req, res) => {
  const { text } = req.body;
  if (!text || typeof text !== 'string') return res.status(400).json({ error: 'Texto inválido' });

  try {
    await db.collection('suggestions').insertOne({ text, date: new Date().toISOString() });
    res.json({ message: 'Sugerencia guardada' });
  } catch (err) {
    console.error('❌ Error al guardar sugerencia:', err);
    res.status(500).json({ error: 'No se pudo guardar' });
  }
});
