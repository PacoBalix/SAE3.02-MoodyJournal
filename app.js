/**
 * MoodyJournal - Serveur Express.js
 * 
 * Application de journal personnel avec blog intégré
 * Fonctionnalités :
 * - Gestion des entrées de journal (CRUD)
 * - Blog avec articles markdown
 * - Interface utilisateur moderne
 * 
 * @author MoodyJournal Team
 * @version 1.0.0
 */

// === IMPORTS ===
const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const marked = require('marked');
const handlebars = require('handlebars');

// === CONFIGURATION ===
const app = express();
const PORT = process.env.PORT || 3000;

// Cache pour optimiser les performances du blog
let articlesCache = null;
let templateCache = null;
let lastCacheUpdate = 0;
const CACHE_DURATION = 300000; // 5 minutes

// Chemin du fichier de données
const DATA_FILE = path.join(__dirname, 'data', 'journal.json');

// === MIDDLEWARE ===
app.use(express.json()); // Parser JSON pour les requêtes POST
app.use('/assets', express.static('assets')); // Servir les assets statiques

/**
 * Crée le dossier data s'il n'existe pas
 */
const ensureDir = async () => {
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
};

// === ROUTES API ===

/**
 * POST /api/save-journal
 * Sauvegarde une nouvelle entrée de journal
 */
app.post('/api/save-journal', async (req, res) => {
    try {
        const newEntry = req.body;
        newEntry.savedAt = new Date().toISOString();

        await ensureDir();
        
        // Charger les données existantes
        let data = [];
        try {
            const fileContent = await fs.readFile(DATA_FILE, 'utf-8');
            if (fileContent.trim()) {
                data = JSON.parse(fileContent);
            }
        } catch (err) {
            console.warn('Fichier journal.json inexistant, création d\'un nouveau.');
        }

        // Ajouter la nouvelle entrée
        data.push(newEntry);
        await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');

        console.log('✅ Journal sauvegardé');
        res.status(200).send('Journal saved');
    } catch (err) {
        console.error('Erreur lors de la sauvegarde:', err);
        res.status(500).send('Erreur serveur');
    }
});

/**
 * GET /api/journal-entries
 * Récupère toutes les entrées du journal
 */
app.get('/api/journal-entries', async (req, res) => {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf-8');
        const entries = JSON.parse(data);
        res.json(entries);
    } catch (err) {
        console.error('Erreur lors de la lecture du journal:', err);
        res.status(500).json({ error: 'Impossible de charger les entrées du journal.' });
    }
});

// === FONCTIONS BLOG ===

/**
 * Parse un fichier markdown et extrait les métadonnées
 * @param {string} filePath - Chemin vers le fichier markdown
 * @returns {Object|null} - Objet avec métadonnées et contenu HTML
 */
async function parseMarkdownFile(filePath) {
    try {
        const content = await fs.readFile(filePath, 'utf-8');
        
        // Extraction des métadonnées (front matter YAML)
        const metaRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
        const match = content.match(metaRegex);
        
        let metadata = {};
        let markdownContent = content;
        
        if (match) {
            // Parsing des métadonnées YAML-like
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
        
        // Génération d'un extrait propre
        const cleanText = markdownContent
            .replace(/^#+\s*/gm, '') // Supprimer les titres markdown
            .replace(/[*`\[\]]/g, '') // Supprimer les caractères markdown
            .replace(/\n+/g, ' ') // Remplacer les retours à la ligne
            .trim();
        const excerpt = cleanText.length > 200 ? cleanText.substring(0, 200) + '...' : cleanText;
        
        // Calcul du temps de lecture (200 mots/minute)
        const wordCount = markdownContent.split(/\s+/).length;
        const readTime = Math.ceil(wordCount / 200);
        
        return {
            ...metadata,
            content: htmlContent,
            excerpt,
            readTime,
            slug: path.basename(filePath, '.md')
        };
    } catch (error) {
        console.error(`Erreur lors de la lecture du fichier ${filePath}:`, error);
        return null;
    }
}

/**
 * Récupère tous les articles du blog avec cache
 * @returns {Array} - Liste des articles triés par date
 */
async function getAllArticles() {
    const now = Date.now();
    
    // Retourner le cache si valide
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
        
        // Tri par date (plus récent en premier)
        articles.sort((a, b) => {
            const dateA = a.date ? new Date(a.date) : new Date(0);
            const dateB = b.date ? new Date(b.date) : new Date(0);
            return dateB - dateA;
        });
        
        // Valeurs par défaut pour les articles sans métadonnées
        articles.forEach(article => {
            if (!article.title) article.title = 'Article sans titre';
            if (!article.date) article.date = 'Date non spécifiée';
        });
        
        // Mise en cache
        articlesCache = articles;
        lastCacheUpdate = now;
        
        return articles;
    } catch (error) {
        console.error('Erreur lors de la lecture des articles:', error);
        return [];
    }
}

/**
 * Compile le template Handlebars avec cache
 * @returns {Function} - Fonction de compilation Handlebars
 */
async function getTemplate() {
    if (!templateCache) {
        const template = await fs.readFile(path.join(__dirname, 'public', 'blog.html'), 'utf-8');
        templateCache = handlebars.compile(template);
    }
    return templateCache;
}

// === ROUTES BLOG ===

/**
 * GET /blog
 * Page d'index du blog
 */
app.get('/blog', async (req, res) => {
    try {
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

/**
 * GET /blog/:slug
 * Page d'un article individuel
 */
app.get('/blog/:slug', async (req, res) => {
    try {
        const slug = req.params.slug;
        const articles = await getAllArticles();
        const article = articles.find(a => a.slug === slug);
        
        if (!article) {
            return res.status(404).send('Article non trouvé');
        }
        
        const compiledTemplate = await getTemplate();
        
        // Navigation entre articles
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

// === ROUTES PAGES ===

/**
 * GET /
 * Page d'accueil
 */
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

/**
 * GET /journal
 * Page d'écriture du journal
 */
app.get('/journal', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'journal.html'));
});

/**
 * GET /view
 * Page de visualisation des données
 */
app.get('/view', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'view.html'));
});

// === MIDDLEWARE STATIQUE ===
// Servir les fichiers statiques (CSS, JS, images) APRÈS les routes personnalisées
app.use(express.static(path.join(__dirname, 'public'), {
    index: false // Ne pas servir index.html automatiquement
}));

// === DÉMARRAGE DU SERVEUR ===
app.listen(PORT, () => {
    console.log(`🚀 Serveur MoodyJournal démarré sur http://localhost:${PORT}`);
    console.log(`📂 Pages disponibles : /, /journal, /view, /blog`);
    console.log(`📝 Blog avec articles markdown : /blog`);
    console.log(`🔧 API : /api/save-journal, /api/journal-entries`);
});