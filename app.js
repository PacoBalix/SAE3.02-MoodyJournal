const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const app = express();
const PORT = 3000;

// === Middleware ===
app.use(express.json()); // pour parser le JSON

// Servir les fichiers statiques (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public'))); // sert le dossier /public
// Servir les assets
app.use('/assets', express.static('assets'));


// Définition du chemin du fichier journal.json
const DATA_FILE = path.join(__dirname, 'data', 'journal.json');

const ensureDir = async () => {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
};


// Fonction de sauvegarde du journal (utilisé par journal.html)
app.post('/api/save-journal', async (req, res) => {
  try {
    const newEntry = req.body;
    newEntry.savedAt = new Date().toISOString();

    await ensureDir();
    let data = [];
    try {
      const fileContent = await fs.readFile(DATA_FILE, 'utf-8');
      if (fileContent.trim()) {
        data = JSON.parse(fileContent);
      }
    } catch (err) {
      console.warn('Fichier inexistant ou corrompu, création d’un nouveau.');
    }

    data.push(newEntry);
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');

    console.log('✅ Journal sauvegardé');
    res.status(200).send('Journal saved');
  } catch (err) {
    console.error('Erreur :', err);
    res.status(500).send('Erreur serveur');
  }
});

// Route pour récupérer les entrées du journal (utilisé par view.html)
app.get('/api/journal-entries', async (req, res) => {
  try {
    const data = await fs.readFile(path.join(__dirname, 'data', 'journal.json'), 'utf-8');
    const entries = JSON.parse(data);
    res.json(entries);
  } catch (err) {
    console.error('Erreur lors de la lecture du fichier journal.json:', err);
    res.status(500).json({ error: 'Impossible de charger les entrées du journal.' });
  }
});

// === Démarrage du serveur ===
app.listen(PORT, () => {
  console.log(`🚀 Serveur en cours sur http://localhost:${PORT}`);
  console.log(`📂 Assure-toi que les pages HTML soit dans /public`);
});   