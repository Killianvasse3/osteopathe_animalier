# 📦 Guide de Sauvegarde Firestore - Gratuit

Ce guide vous explique comment sauvegarder votre base de données Firestore sans utiliser les services payants de Firebase.

## 🚀 Méthodes Disponibles

### 1. **Script Node.js Local** (Recommandé)

#### Installation
```bash
# Installer les dépendances
npm install firebase-admin

# Démarrer l'émulateur Firestore
firebase emulators:start --only firestore

# Dans un autre terminal, exécuter le script
node backup-firestore.js
```

#### Utilisation
```bash
# Sauvegarde simple
npm run backup

# Sauvegarde avec émulateur
npm run backup:start-emulator
```

### 2. **Cloud Functions** (Gratuit dans les quotas)

#### Déploiement
```bash
# Déployer les fonctions
firebase deploy --only functions

# Appeler la fonction de sauvegarde depuis votre app
const backupFunction = firebase.functions().httpsCallable('backupFirestore');
const result = await backupFunction();
```

#### Sauvegarde programmée
- La fonction `scheduledBackup` s'exécute automatiquement tous les jours à 2h du matin
- Gratuit dans les limites des quotas Firebase (2M d'invocations/mois)

### 3. **Firebase CLI avec émulateurs**

#### Export complet
```bash
# Démarrer l'émulateur avec export
firebase emulators:start --only firestore --export-on-exit=./backups/latest

# Export manuel
firebase emulators:export ./backups/export-$(date +%Y%m%d-%H%M%S)
```

#### Import des données
```bash
# Importer une sauvegarde
firebase emulators:start --only firestore --import=./backups/latest
```

## 📁 Structure des Sauvegardes

```
backups/
├── firestore-2024-01-15T10-30-00-000Z/
│   ├── firestore-backup.json      # Données complètes
│   └── metadata.json              # Métadonnées
└── latest/                        # Dernière sauvegarde (émulateur)
    └── firestore_export/
```

## 🔧 Configuration Avancée

### Variables d'environnement
```bash
# Pour le script local
export FIRESTORE_EMULATOR_HOST=localhost:9090

# Pour les Cloud Functions
export GCLOUD_PROJECT=votre-project-id
```

### Personnalisation des collections
Modifiez le tableau `collections` dans les scripts pour inclure/exclure des collections :

```javascript
const collections = [
  'users',
  'animals', 
  'appointments',
  // Ajoutez ou supprimez selon vos besoins
];
```

## 📊 Monitoring et Logs

### Logs des Cloud Functions
```bash
# Voir les logs de sauvegarde
firebase functions:log --only backupFirestore

# Logs de la sauvegarde programmée
firebase functions:log --only scheduledBackup
```

### Métadonnées de sauvegarde
Chaque sauvegarde inclut :
- Timestamp de création
- Nombre total de documents
- Nombre de documents par collection
- ID du projet

## ⚠️ Limitations et Bonnes Pratiques

### Limitations gratuites
- **Cloud Functions** : 2M invocations/mois, 400K GB-seconde/mois
- **Firestore** : 50K lectures/mois, 20K écritures/mois
- **Storage** : 5GB/mois

### Bonnes pratiques
1. **Fréquence** : Sauvegarde quotidienne recommandée
2. **Rétention** : Garder 7-30 jours de sauvegardes
3. **Test** : Tester régulièrement la restauration
4. **Sécurité** : Chiffrer les sauvegardes sensibles

## 🔄 Restauration

### Depuis un fichier JSON
```javascript
// Script de restauration
const backupData = require('./backups/firestore-2024-01-15T10-30-00-000Z/firestore-backup.json');

for (const [collectionName, documents] of Object.entries(backupData.collections)) {
  for (const doc of documents) {
    await db.collection(collectionName).doc(doc.id).set(doc);
  }
}
```

### Depuis l'émulateur
```bash
# Démarrer avec import
firebase emulators:start --only firestore --import=./backups/latest
```

## 🆘 Dépannage

### Erreurs courantes
1. **"Emulator not running"** : Démarrer l'émulateur Firestore
2. **"Permission denied"** : Vérifier les règles Firestore
3. **"Quota exceeded"** : Attendre le reset mensuel ou optimiser

### Support
- Consultez les logs : `firebase functions:log`
- Vérifiez les quotas : Console Firebase > Usage
- Documentation : https://firebase.google.com/docs

## 📈 Optimisations

### Pour réduire les coûts
1. **Filtrage** : Sauvegarder seulement les collections nécessaires
2. **Compression** : Utiliser gzip pour les gros fichiers
3. **Incrémental** : Sauvegarder seulement les changements

### Exemple de sauvegarde incrémentale
```javascript
// Sauvegarder seulement les documents modifiés depuis la dernière sauvegarde
const lastBackup = new Date('2024-01-14T10:30:00Z');
const snapshot = await db.collection('users')
  .where('updatedAt', '>', lastBackup)
  .get();
```

---

**💡 Conseil** : Testez toujours vos sauvegardes en les restaurant dans un environnement de développement avant de compter dessus en production !
