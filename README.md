# 🎨 Interactive Data Visualization Generator

Une application JavaScript sophistiquée qui démontre les techniques modernes de développement web à travers une plateforme de visualisation de données interactive. Ce projet présente les fonctionnalités avancées d'ES6+, les modèles de programmation asynchrone, l'architecture modulaire et le traitement de données en temps réel.

![GitHub stars](https://img.shields.io/github/stars/LeKyuFr/interactive-dataviz-generator?style=social)
![License](https://img.shields.io/github/license/LeKyuFr/interactive-dataviz-generator)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)
![Vite](https://img.shields.io/badge/Vite-5.0-646CFF)

## ✨ Fonctionnalités

### 📊 Types de Graphiques Multiples
- **Graphiques en Barres** - Analyse des revenus par secteur avec transitions animées
- **Graphiques Linéaires** - Données de séries temporelles avec support multi-séries
- **Graphiques en Secteurs** - Distribution des parts de marché avec segments interactifs
- **Nuages de Points** - Analyse de corrélation avec regroupement catégoriel
- **Cartes de Chaleur** - Modèles d'activité avec rendu canvas personnalisé

### 🚀 Fonctionnalités JavaScript Avancées
- **Modules ES6+** - Architecture modulaire propre avec import/export
- **Async/Await** - Traitement de données asynchrone sophistiqué
- **APIs Web** - Gestion de fichiers, manipulation canvas, stockage local
- **Architecture Événementielle** - Système de gestion d'état réactif
- **POO basée sur les Classes** - Modèles de conception orientés objet modernes
- **Gestion d'Erreurs** - Try/catch complet avec retour utilisateur

### 🎯 Capacités Temps Réel
- **Mises à Jour de Données en Direct** - Streaming de données simulé type WebSocket
- **Intervalles Configurables** - Fréquences de mise à jour personnalisables
- **Optimisé Performance** - Rendu efficace et gestion mémoire
- **Traitement en Arrière-Plan** - Génération de données non-bloquante

### 🎨 Expérience Utilisateur
- **Design Réactif** - Approche mobile-first avec CSS Grid/Flexbox
- **Thèmes Sombre/Clair** - Commutation de thème dynamique avec variables CSS
- **Animations Fluides** - Transitions accélérées matériellement
- **Tooltips Interactifs** - Capacités d'exploration de données riches
- **Système de Notifications** - Retour utilisateur pour toutes les actions

### 📤 Fonctionnalité d'Export
- **Export PNG** - Génération d'images haute résolution
- **Export SVG** - Graphiques vectoriels pour la scalabilité
- **Export JSON** - Données brutes en format structuré
- **Import CSV** - Upload et analyse de fichiers

## 🛠 Stack Technologique

- **Vite** - Outil de build ultra-rapide et serveur de développement
- **Chart.js** - Bibliothèque de graphiques professionnelle
- **Canvas API** - Rendu de visualisation personnalisé
- **Variables CSS** - Système de thématisation dynamique
- **Modules ES6** - Architecture JavaScript moderne
- **File API** - Traitement de fichiers côté client
- **HTML5 Canvas** - Dessins et animations personnalisés

## 🚦 Pour Commencer

### Prérequis
- Node.js (v14 ou supérieur)
- Gestionnaire de paquets npm ou yarn

### Installation

1. **Cloner le dépôt**
   ```bash
   git clone https://github.com/LeKyuFr/interactive-dataviz-generator.git
   cd interactive-dataviz-generator
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Démarrer le serveur de développement**
   ```bash
   npm run dev
   ```

4. **Ouvrir votre navigateur**
   Naviguer vers `http://localhost:5173`

### Build pour la Production

```bash
npm run build
npm run preview
```

## 📁 Structure du Projet

```
├── src/
│   ├── main.js              # Point d'entrée de l'application
│   ├── style.css            # Styles globaux et thèmes
│   ├── charts/              # Rendus de graphiques
│   │   └── ChartRenderer.js # Moteur de rendu principal
│   ├── data/                # Génération et traitement des données
│   │   ├── DataGenerator.js # Générateur de données
│   │   └── FileHandler.js   # Gestion des fichiers
│   ├── exports/             # Fonctionnalités d'export
│   │   └── ExportManager.js # Gestionnaire d'exports
│   ├── state/               # Gestion d'état
│   │   └── AppState.js      # État centralisé
│   ├── ui/                  # Contrôleurs d'interface
│   │   └── UIController.js  # Contrôleur principal UI
│   └── utils/               # Utilitaires
│       ├── App.js           # Application principale
│       ├── NotificationManager.js # Notifications
│       └── ThemeManager.js  # Gestion des thèmes
├── public/                  # Ressources statiques
│   ├── sample-data.csv      # Données d'exemple
│   └── vite.svg            # Logo Vite
├── package.json             # Dépendances et scripts
├── tailwind.config.js       # Configuration Tailwind
├── postcss.config.js        # Configuration PostCSS
├── vite.config.js          # Configuration de build
└── README.md               # Documentation du projet
```

## 🎮 Guide d'Utilisation

### Opérations de Base

1. **Sélectionner le Type de Graphique** - Cliquer sur les boutons de type dans la barre latérale
2. **Générer des Données** - Utiliser "Générer des Données d'Exemple" pour des jeux de données réalistes
3. **Mode Temps Réel** - Activer les mises à jour en direct avec intervalles personnalisables
4. **Changement de Thème** - Basculer entre les modes clair et sombre
5. **Exporter les Graphiques** - Sauvegarder les visualisations en plusieurs formats

### Fonctionnalités Avancées

#### Upload de Données Personnalisées
```javascript
// Uploader des fichiers CSV ou JSON
const fileInput = document.getElementById('file-input');
fileInput.addEventListener('change', handleFileUpload);
```

#### Simulation de Données Temps Réel
```javascript
// Configurer les intervalles de mise à jour
const settings = {
  updateInterval: 1500,  // millisecondes
  dataPoints: 20,        // nombre de points
  animationSpeed: 800    // durée d'animation
};
```

#### Personnalisation des Thèmes
```css
:root {
  --primary-color: #2563eb;
  --success-color: #10b981;
  --error-color: #ef4444;
  /* ... plus de variables */
}
```

## 🏗 Aperçu de l'Architecture

### Gestion d'État
```javascript
class AppState {
  // État centralisé avec système d'événements
  // Mises à jour réactives et abonnements
  // Modèles d'état immuables
}
```

### Traitement des Données
```javascript
class DataGenerator {
  // Génération de données asynchrone
  // Modèles d'entreprise réalistes
  // Support de plusieurs types de graphiques
}
```

### Moteur de Rendu
```javascript
class ChartRenderer {
  // Intégration Chart.js
  // Rendu canvas personnalisé
  // Optimisation des performances
}
```

## 🔧 Configuration

### Paramètres des Graphiques
```javascript
const chartConfig = {
  animation: {
    duration: 800,
    easing: 'easeInOutQuart'
  },
  responsive: true,
  maintainAspectRatio: false
};
```

### Variables de Thème
```css
[data-theme="dark"] {
  --bg-color: #0f172a;
  --text-color: #f1f5f9;
  --primary-color: #3b82f6;
}
```

## 📊 Fonctionnalités de Performance

- **Chargement Paresseux** - Composants chargés à la demande
- **Mises à Jour Débounced** - Rendu temps réel optimisé
- **Gestion Mémoire** - Nettoyage approprié et garbage collection
- **Optimisation Canvas** - Opérations de dessin efficaces
- **Division de Bundle** - Sortie de build optimisée

## 🧪 Exemples de Code

### Création de Graphiques Personnalisés
```javascript
// Générer et rendre des données personnalisées
const data = await DataGenerator.generateData('bar', 15);
const chart = await renderer.render(data, 'bar');

// Ajouter des interactions personnalisées
chart.options.onClick = (event, elements) => {
  // Gestion de clic personnalisée
};
```

### Mises à Jour Temps Réel
```javascript
// Démarrer la simulation temps réel
const simulator = new RealTimeSimulator(state, updateCallback);
simulator.start();

// Configurer le comportement de mise à jour
simulator.setInterval(2000);
simulator.setDataPoints(25);
```

### Fonctionnalité d'Export
```javascript
// Exporter vers différents formats
await ExportManager.exportPNG(chart);
await ExportManager.exportSVG(data);
await ExportManager.exportJSON(data);
```

## 🎯 Concepts d'Apprentissage Clés

Ce projet démontre :

- **Modèles JavaScript Modernes** - Classes, modules, async/await
- **Architecture Événementielle** - Implémentation du pattern Pub/Sub
- **Programmation Canvas** - Rendu et animations personnalisés
- **APIs Web** - Gestion de fichiers, stockage, et plus
- **Optimisation Performance** - Rendu efficace et utilisation mémoire
- **Design UX** - Interfaces réactives et accessibles
- **Outils de Build** - Workflow de développement moderne avec Vite

## 🌟 Fonctionnalités Avancées

### Implémentation Heatmap Personnalisée
```javascript
renderHeatmap(data) {
  // Heatmap basée sur canvas personnalisé
  // Algorithmes d'interpolation de couleurs
  // Effets de survol interactifs
}
```

### Système de Notifications
```javascript
NotificationManager.show('Succès !', 'success', 3000);
// Notifications style toast avec animations
```

### Traitement de Fichiers
```javascript
const data = await FileHandler.processFile(csvFile);
// Analyse et validation CSV automatique
```

## 🤝 Contribuer

1. Fork le dépôt
2. Créer une branche de fonctionnalité (`git checkout -b feature/fonctionnalite-incroyable`)
3. Commit vos changements (`git commit -m 'Ajouter fonctionnalité incroyable'`)
4. Push vers la branche (`git push origin feature/fonctionnalite-incroyable`)
5. Ouvrir une Pull Request

## 📜 Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour les détails.

## 🙏 Remerciements

- L'équipe Chart.js pour l'excellente bibliothèque de graphiques
- L'équipe Vite pour l'outil de build fantastique
- Tous les contributeurs et la communauté open-source

## 📞 Contact

- **GitHub**: [@LeKyuFr](https://github.com/LeKyuFr)

---

⭐ **Si vous avez trouvé ce projet utile, merci de lui donner une étoile !** ⭐

Construit avec le ❤️ en utilisant JavaScript moderne et des technologies web de pointe.
