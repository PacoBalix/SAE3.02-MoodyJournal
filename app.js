const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const marked = require('marked');
const handlebars = require('handlebars');

const app = express();
const PORT = 3000;

// Cache pour optimiser les performances (chargement paresseux)
let articlesCache = null;
let templateCache = null;
let lastCacheUpdate = 0;
const CACHE_DURATION = 300000; // 5 minutes (plus long car c'est une sous-fonctionnalité)

// === Middleware ===

// Servir les assets (mais PAS les fichiers HTML du blog)
app.use('/assets', express.static('assets')); // Servir les assets

// Définition du chemin du fichier journal.json
const DATA_FILE = path.join(__dirname, 'data', 'journal.json');
app.use(express.json()); // pour parser le JSON

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
      console.warn('Fichier inexistant ou corrompu, création d\'un nouveau.');
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

// Fonction pour lire et parser les métadonnées des fichiers markdown
async function parseMarkdownFile(filePath) {
    try {
        const content = await fs.readFile(filePath, 'utf-8');
        
        // Extraction des métadonnées (front matter)
        const metaRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
        const match = content.match(metaRegex);
        
        let metadata = {};
        let markdownContent = content;
        
        if (match) {
            // Parsing simple des métadonnées YAML-like
            const metaLines = match[1].split('\n');
            metaLines.forEach(line => {
                const trimmedLine = line.trim();
                if (trimmedLine && trimmedLine.includes(':')) {
                    const colonIndex = trimmedLine.indexOf(':');
                    const key = trimmedLine.substring(0, colonIndex).trim();
                    const value = trimmedLine.substring(colonIndex + 1).trim().replace(/^["']|["']$/g, '');
                    if (key && value) {
                        metadata[key] = value;
                    }
                }
            });
            markdownContent = match[2];
        }
        
        // Conversion markdown vers HTML
        const htmlContent = marked.parse(markdownContent);
        
        // Génération d'un extrait (enlever les métadonnées et le markdown)
        const cleanText = markdownContent
            .replace(/^#+\s*/gm, '') // Enlever les titres markdown
            .replace(/[*`\[\]]/g, '') // Enlever les caractères markdown
            .replace(/\n+/g, ' ') // Remplacer les retours à la ligne par des espaces
            .trim();
        const excerpt = cleanText.length > 200 ? cleanText.substring(0, 200) + '...' : cleanText;
        
        // Calcul du temps de lecture (approximatif)
        const wordCount = markdownContent.split(/\s+/).length;
        const readTime = Math.ceil(wordCount / 200); // 200 mots par minute
        
        const result = {
            ...metadata,
            content: htmlContent,
            excerpt,
            readTime,
            slug: path.basename(filePath, '.md')
        };
        
        // Debug: afficher les métadonnées extraites (commenté pour la production)
        // console.log(`Article ${result.slug}:`, {
        //     title: result.title,
        //     date: result.date,
        //     metadata: metadata
        // });
        
        return result;
    } catch (error) {
        console.error(`Erreur lors de la lecture du fichier ${filePath}:`, error);
        return null;
    }
}

// Fonction pour obtenir tous les articles (avec cache paresseux)
async function getAllArticles() {
    const now = Date.now();
    
    // Retourner le cache si il est encore valide
    if (articlesCache && (now - lastCacheUpdate) < CACHE_DURATION) {
        return articlesCache;
    }
    
    try {
        const dataDir = path.join(__dirname, 'data');
        const files = await fs.readdir(dataDir);
        const markdownFiles = files.filter(file => file.endsWith('.md'));
        
        const articles = [];
        for (const file of markdownFiles) {
            const filePath = path.join(dataDir, file);
            const article = await parseMarkdownFile(filePath);
            if (article) {
                articles.push(article);
            }
        }
        
        // Tri par date (plus récent en premier) - avec gestion des dates manquantes
        articles.sort((a, b) => {
            const dateA = a.date ? new Date(a.date) : new Date(0);
            const dateB = b.date ? new Date(b.date) : new Date(0);
            return dateB - dateA;
        });
        
        // Ajouter des valeurs par défaut pour les articles sans métadonnées
        articles.forEach(article => {
            if (!article.title) {
                article.title = 'Article sans titre';
            }
            if (!article.date) {
                article.date = 'Date non spécifiée';
            }
        });
        
        // Mettre en cache
        articlesCache = articles;
        lastCacheUpdate = now;
        
        return articles;
    } catch (error) {
        console.error('Erreur lors de la lecture des articles:', error);
        return [];
    }
}

// Fonction pour initialiser le template (chargement paresseux)
async function getTemplate() {
    if (!templateCache) {
        const template = await fs.readFile(path.join(__dirname, 'public', 'blog.html'), 'utf-8');
        templateCache = handlebars.compile(template);
    }
    return templateCache;
}

// Route pour la page d'index du blog (chargement paresseux)
app.get('/blog', async (req, res) => {
    try {
        // Charger les données seulement quand la page est demandée
        const articles = await getAllArticles();
        const compiledTemplate = await getTemplate();
        
        const html = compiledTemplate({
            isBlogIndex: true,
            articles: articles
        });
        
        res.send(html);
    } catch (error) {
        console.error('Erreur lors du chargement de la page blog:', error);
        res.status(500).send('Erreur lors du chargement de la page blog');
    }
});

// Route pour un article individuel (chargement paresseux)
app.get('/blog/:slug', async (req, res) => {
    try {
        const slug = req.params.slug;
        const articles = await getAllArticles();
        const article = articles.find(a => a.slug === slug);
        
        if (!article) {
            return res.status(404).send('Article non trouvé');
        }
        
        const compiledTemplate = await getTemplate();
        
        // Trouver l'article précédent et suivant
        const currentIndex = articles.findIndex(a => a.slug === slug);
        const prevArticle = currentIndex < articles.length - 1 ? articles[currentIndex + 1] : null;
        const nextArticle = currentIndex > 0 ? articles[currentIndex - 1] : null;
        
        const html = compiledTemplate({
            isBlogIndex: false,
            title: article.title || 'Article sans titre',
            date: article.date || 'Date non spécifiée',
            readTime: article.readTime || 5,
            content: article.content,
            prevArticle,
            nextArticle
        });
        
        res.send(html);
    } catch (error) {
        console.error('Erreur lors du chargement de l\'article:', error);
        res.status(500).send('Erreur lors du chargement de l\'article');
    }
});

// Routes pour les pages HTML (AVANT le middleware statique)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/journal', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'journal.html'));
});

app.get('/view', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'view.html'));
});

// Middleware statique pour les assets (CSS, JS, images) - APRÈS les routes HTML
app.use(express.static(path.join(__dirname, 'public'), {
    index: false // Ne pas servir index.html automatiquement
}));

// === Démarrage du serveur ===
app.listen(PORT, () => {
  console.log(`🚀 Serveur en cours sur http://localhost:${PORT}`);
  console.log(`📂 Assure-toi que les pages HTML soit dans /public`);
  console.log(`📝 Blog disponible sur http://localhost:${PORT}/blog`);
});