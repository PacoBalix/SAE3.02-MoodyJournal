---
title: Git/GitHub Cheat Sheet - Gestion de Projet
date: 2024-01-05
author: Équipe MoodyJournal
category: Développement
tags: git, github, développement, collaboration, versioning
---

# Git/GitHub Cheat Sheet - Gestion de Projet

## 🔧 Configuration initiale
```bash
git config --global user.name "Ton Nom"
git config --global user.email "ton.email@example.com"
```

## 📁 Initialisation du projet
```bash
# Initialiser un nouveau projet
git init

# Cloner un projet existant
git clone https://github.com/username/repository.git

# Lier à un repository distant
git remote add origin https://github.com/username/repository.git
```

## 📋 Commandes essentielles quotidiennes

### État et ajout de fichiers
```bash
git status                 # Voir l'état des fichiers
git add .                  # Ajouter tous les fichiers modifiés
git add fichier.txt        # Ajouter un fichier spécifique
git commit -m "Message"    # Valider les changements
```

### Synchronisation avec GitHub
```bash
git pull origin main       # Récupérer les dernières modifications
git push origin main       # Envoyer les modifications
git fetch                  # Récupérer infos sans fusionner
```

## 🌿 Gestion des branches

### Création et navigation
```bash
git branch                 # Lister les branches
git checkout -b nouvelle-branche    # Créer et basculer sur nouvelle branche
git checkout main          # Basculer sur main
git branch -d nom-branche  # Supprimer une branche locale
```

### Fusion
```bash
git checkout main
git merge nom-branche      # Fusionner une branche dans main
git push origin main       # Pousser la fusion
```

## 🔄 Workflow collaboratif type

### Pour chaque nouvelle fonctionnalité
```bash
# 1. Se mettre à jour
git checkout main
git pull origin main

# 2. Créer une branche pour la fonctionnalité
git checkout -b feature/nom-fonctionnalite

# 3. Travailler et commiter
git add .
git commit -m "feat: description de la fonctionnalité"

# 4. Pousser la branche
git push origin feature/nom-fonctionnalite

# 5. Créer une Pull Request sur GitHub
```

## 📜 Historique et informations
```bash
git log                    # Voir l'historique des commits
git log --oneline          # Historique condensé
git show                   # Détails du dernier commit
git diff                   # Voir les modifications non commitées
```

## 🏷️ Tags (versions)
```bash
git tag -a v1.0 -m "Version 1.0"    # Créer un tag
git push origin v1.0                # Pousser le tag
git tag -l                          # Lister les tags
```

## 🚨 Gestion des conflits
```bash
# En cas de conflit lors d'un pull/merge
git status                 # Voir les fichiers en conflit
# Éditer manuellement les fichiers pour résoudre
git add .                  # Marquer comme résolu
git commit -m "resolve: conflits fusionnés"
```

## 🔄 Commandes d'urgence

### Annuler des modifications
```bash
git checkout -- fichier.txt    # Annuler modif d'un fichier non commité
git reset HEAD fichier.txt      # Désindexer un fichier
git reset --soft HEAD~1         # Annuler le dernier commit (garde les modifs)
git reset --hard HEAD~1         # Annuler le dernier commit (supprime tout)
```

### Récupération
```bash
git stash                  # Mettre de côté les modifications
git stash pop              # Récupérer les modifications mises de côté
git reflog                 # Voir l'historique de toutes les actions
```

## 📁 Fichier .gitignore type
```
# Dépendances
node_modules/
*.log

# Fichiers de build
dist/
build/
*.zip

# IDE
.vscode/
.idea/
*.swp

# OS
.DS_Store
Thumbs.db

# Variables d'environnement
.env
.env.local
```

## 🎯 Convention de nommage des commits
```bash
feat: nouvelle fonctionnalité
fix: correction de bug
docs: documentation
style: formatage, point-virgules manquants, etc.
refactor: refactorisation du code
test: ajout de tests
chore: mise à jour des tâches de build, config, etc.
```

## 🔗 Commandes utiles pour la collaboration
```bash
git remote -v              # Voir les repositories distants
git branch -r              # Voir les branches distantes
git pull --rebase          # Pull avec rebase (historique plus propre)
git push -u origin branche # Pousser et tracker la branche
```

---

## 🚀 Workflow rapide quotidien
1. `git status` - Vérifier l'état
2. `git add .` - Ajouter les fichiers
3. `git commit -m "message"` - Commiter
4. `git pull origin main` - Se mettre à jour
5. `git push origin main` - Pousser les changements