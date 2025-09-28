# Projet SAE 3.02 - MoodyJournal

## Description

**MoodyJournal** est une application web conçue pour permettre à ses utilisateurs de :
- **Exprimer leurs émotions** et suivre leur humeur au quotidien.
- **Documenter leurs journées** en notant leurs meilleurs moments, leurs défis, et leurs habitudes.
- **Visualiser leurs progrès** grâce à une interface intuitive et organisée.

Ce projet s'inscrit dans une démarche de bien-être personnel et de développement, en offrant un espace sécurisé pour la réflexion et l'amélioration continue.

---

## Fonctionnalités

### 1. **Journal quotidien**
- Remplissez un formulaire pour documenter votre journée :
  - Humeur (sur une échelle de 1 à 10).
  - Mots-clés pour décrire vos émotions.
  - Moments de gratitude.
  - Meilleurs moments, défis, et habitudes.
  - 

### 2. **Visualisation des entrées**
- Consultez vos entrées précédentes dans une interface claire et organisée.
- Naviguez entre les jours grâce à un sélecteur de date ou des boutons "Précédent" et "Suivant".

### 3. **Sauvegarde des données**
- Les données sont sauvegardées dans un fichier JSON côté serveur pour une persistance simple et efficace.

### 4. **Interface moderne et responsive**
- Utilisation de **TailwindCSS** pour un design épuré et adapté à tous les appareils.
- Fond animé interactif grâce à **Vanta.js**.

---

## Installation

### Prérequis
- **Node.js** (version 16 ou supérieure)
- **npm** (inclus avec Node.js)

### Étapes
1. Clonez ce dépôt :
   ```
   git clone https://github.com/PacoBalix/MoodyJournal.git
   cd MoodyJournal
   ```

2. Installez les dépendances :
    ```
    npm install
    ```

3. Démarrez le serveur :
    ```
    node app.js
    ```

4. Ouvrez votre navigateur et accédez à :
    ```
    http://localhost:3000
    ```