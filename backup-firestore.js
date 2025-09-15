#!/usr/bin/env node

/**
 * Script de sauvegarde Firestore gratuit
 * Utilise les émulateurs Firebase pour exporter les données
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Configuration pour la production
const serviceAccount = require('./config/serviceAccountKey.json');

// Initialiser Firebase Admin avec votre projet
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: 'osteopatheanimalier-50728'
  });
}

const db = admin.firestore();

/**
 * Fonction pour exporter une collection complète
 */
async function exportCollection(collectionName) {
  console.log(`📦 Export de la collection: ${collectionName}`);
  
  try {
    const snapshot = await db.collection(collectionName).get();
    const data = [];
    
    snapshot.forEach(doc => {
      data.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return data;
  } catch (error) {
    console.error(`❌ Erreur lors de l'export de ${collectionName}:`, error);
    return [];
  }
}

/**
 * Fonction principale de sauvegarde
 */
async function backupFirestore() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = `backups/firestore-${timestamp}`;
  
  // Créer le dossier de sauvegarde
  if (!fs.existsSync('backups')) {
    fs.mkdirSync('backups');
  }
  fs.mkdirSync(backupDir);
  
  console.log('🚀 Début de la sauvegarde Firestore...');
  console.log(`📁 Dossier de sauvegarde: ${backupDir}`);
  
  // Collections à sauvegarder (basées sur vos règles Firestore)
  const collections = [
    'users',
    'animals', 
    'appointments',
    'timeSlots',
    'contact_messages',
    'blog_posts',
    'services',
    'bodyAnnotations',
    'admin_notifications'
  ];
  
  const backupData = {
    timestamp: new Date().toISOString(),
    collections: {}
  };
  
  // Exporter chaque collection
  for (const collectionName of collections) {
    const data = await exportCollection(collectionName);
    backupData.collections[collectionName] = data;
    console.log(`✅ ${collectionName}: ${data.length} documents exportés`);
  }
  
  // Sauvegarder le fichier JSON
  const backupFile = path.join(backupDir, 'firestore-backup.json');
  fs.writeFileSync(backupFile, JSON.stringify(backupData, null, 2));
  
  // Créer un fichier de métadonnées
  const metadata = {
    timestamp: backupData.timestamp,
    totalCollections: collections.length,
    totalDocuments: Object.values(backupData.collections).reduce((sum, docs) => sum + docs.length, 0),
    collections: Object.keys(backupData.collections).reduce((acc, name) => {
      acc[name] = backupData.collections[name].length;
      return acc;
    }, {})
  };
  
  fs.writeFileSync(
    path.join(backupDir, 'metadata.json'), 
    JSON.stringify(metadata, null, 2)
  );
  
  console.log('🎉 Sauvegarde terminée !');
  console.log(`📊 Total: ${metadata.totalDocuments} documents dans ${metadata.totalCollections} collections`);
  console.log(`📁 Fichiers créés:`);
  console.log(`   - ${backupFile}`);
  console.log(`   - ${path.join(backupDir, 'metadata.json')}`);
  
  return backupDir;
}

// Exécuter la sauvegarde si le script est appelé directement
if (require.main === module) {
  backupFirestore()
    .then(backupDir => {
      console.log(`\n✨ Sauvegarde complète dans: ${backupDir}`);
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 Erreur lors de la sauvegarde:', error);
      process.exit(1);
    });
}

module.exports = { backupFirestore, exportCollection };
