# MoodyJournal 🌿

**Votre compagnon digital pour l'équilibre mental et émotionnel**

Une application web moderne de journal personnel avec blog intégré, conçue pour favoriser le bien-être et l'introspection.

## ✨ Fonctionnalités

### 📘 Journal Personnel
- **Écriture intuitive** : Interface simple pour noter vos pensées et émotions
- **Sauvegarde automatique** : Vos entrées sont automatiquement sauvegardées
- **Données sécurisées** : Stockage local avec respect de la confidentialité

### 📊 Visualisation des Données
- **Analytics personnels** : Visualisez vos tendances émotionnelles
- **Navigation temporelle** : Parcourez vos entrées par date
- **Insights** : Découvrez des patterns dans votre bien-être

### 🌐 Blog & Ressources
- **Articles markdown** : Contenu riche avec métadonnées
- **Templates dynamiques** : Rendu avec Handlebars
- **Navigation fluide** : Entre articles avec liens précédent/suivant
- **Cache intelligent** : Performance optimisée

## 🚀 Technologies

### Backend
- **Node.js** : Runtime JavaScript
- **Express.js** : Framework web
- **Handlebars** : Moteur de templates
- **Marked** : Parser markdown

### Frontend
- **HTML5/CSS3** : Structure et styles
- **JavaScript ES6+** : Interactivité
- **Vanta.js** : Backgrounds animés 3D
- **Tailwind CSS** : Framework CSS (pour certaines pages)

### Performance
- **Cache intelligent** : Articles et templates mis en cache
- **Chargement paresseux** : Données chargées à la demande
- **Optimisations** : Middleware optimisé pour les performances

## 📁 Structure du Projet

```
MoodyJournal/
├── app.js                 # Serveur Express principal
├── package.json           # Dépendances Node.js
├── assets/                # Assets statiques
│   └── moodyjournal.svg   # Logo du site
├── data/                  # Données de l'application
│   ├── journal.json       # Entrées du journal
│   ├── anxietyguide.md    # Article markdown
│   ├── githubcheatsheet.md
│   └── psychology.md
└── public/                # Pages web
    ├── index.html         # Page d'accueil
    ├── index.css          # Styles principaux
    ├── journal.html       # Interface d'écriture
    ├── view.html          # Visualisation des données
    └── blog.html          # Template du blog
```

## 🛠️ Installation

### Prérequis
- Node.js (version 14+)
- npm ou yarn

### Démarrage
```bash
# Cloner le projet
git clone https://github.com/PacoBalix/SAE3.02-MoodyJournal.git
cd SAE3.02-MoodyJournal

# Installer les dépendances
npm install

# Démarrer le serveur
npm start
# ou
node app.js
```

L'application sera accessible sur `http://localhost:3000`

## 📖 Utilisation

### Journal Personnel
1. Accédez à `/journal` pour écrire
2. Remplissez votre entrée quotidienne
3. Sauvegardez automatiquement

### Visualisation
1. Allez sur `/view` pour voir vos données
2. Naviguez entre les entrées
3. Analysez vos tendances

### Blog
1. Consultez `/blog` pour les articles
2. Cliquez sur un article pour le lire
3. Naviguez entre les articles

## 🎨 Identité Visuelle

### Couleurs
- **Vert menthe** : `#b2c88e` - Calme et nature
- **Beige** : `#725e5e` - Chaleur et confort
- **Transparences** : Effets glassmorphism modernes

### Typographie
- **Police principale** : Bahnschrift
- **Hiérarchie claire** : Tailles et poids adaptés
- **Lisibilité** : Contraste optimisé

## 🔧 API Endpoints

### Journal
- `POST /api/save-journal` - Sauvegarder une entrée
- `GET /api/journal-entries` - Récupérer toutes les entrées

### Blog
- `GET /blog` - Page d'index du blog
- `GET /blog/:slug` - Article individuel

### Pages
- `GET /` - Page d'accueil
- `GET /journal` - Interface d'écriture
- `GET /view` - Visualisation des données

## 🚀 Fonctionnalités Avancées

### Cache Intelligent
- **Articles** : Cache de 5 minutes pour les performances
- **Templates** : Compilation Handlebars mise en cache
- **Chargement paresseux** : Données chargées à la demande

### Blog Dynamique
- **Markdown** : Support complet du format markdown
- **Métadonnées** : Front-matter YAML pour les articles
- **Navigation** : Liens précédent/suivant automatiques
- **SEO** : Temps de lecture et extraits générés

### Performance
- **Middleware optimisé** : Routes personnalisées avant statiques
- **Gestion d'erreurs** : Try/catch complets
- **Logs informatifs** : Suivi des opérations

## 🤝 Contribution

1. Fork le projet
2. Créez une branche feature (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👥 Équipe

- **Développement** : MoodyJournal Team
- **Design** : Interface moderne et accessible
- **Architecture** : Code modulaire et maintenable

## 🎯 Roadmap

- [ ] Authentification utilisateur
- [ ] Export des données (PDF, CSV)
- [ ] Thèmes personnalisables
- [ ] API mobile
- [ ] Analytics avancés
- [ ] Partage sécurisé

---

**Fait avec ❤️ pour votre bien-être mental et émotionnel**