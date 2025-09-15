#!/usr/bin/env node

/**
 * Script de test de connexion à Firestore de production
 * Utilisez ce script pour vérifier que votre configuration fonctionne
 */

const admin = require('firebase-admin');

console.log('🔍 Test de connexion à Firestore de production\n');

// Configuration pour la production
const serviceAccount = require('./config/serviceAccountKey.json');

// Initialiser Firebase Admin avec votre projet
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: 'osteopatheanimalier-50728'
    });
    console.log('✅ Firebase Admin initialisé');
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation de Firebase Admin:', error.message);
    console.log('\n💡 Solutions possibles:');
    console.log('   1. Vérifiez que votre clé de service est correcte');
    console.log('   2. Vérifiez que le projectId est correct');
    console.log('   3. Vérifiez que vous êtes connecté avec: firebase login');
    process.exit(1);
  }
}

const db = admin.firestore();

/**
 * Test de connexion et de lecture des données
 */
async function testConnection() {
  console.log('🧪 Test de connexion à Firestore...\n');
  
  try {
    // Test 1: Vérifier la connexion
    console.log('📋 Test 1: Vérification de la connexion');
    const testRef = db.collection('_test_connection');
    await testRef.doc('test').set({ timestamp: new Date() });
    await testRef.doc('test').delete();
    console.log('✅ Connexion réussie\n');
    
    // Test 2: Lister les collections
    console.log('📋 Test 2: Vérification des collections');
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
    
    for (const collectionName of collections) {
      try {
        const snapshot = await db.collection(collectionName).limit(1).get();
        console.log(`   ${collectionName}: ${snapshot.size > 0 ? '✅ Contient des données' : '⚠️  Vide'}`);
      } catch (error) {
        console.log(`   ${collectionName}: ❌ Erreur - ${error.message}`);
      }
    }
    
    // Test 3: Compter les documents
    console.log('\n📋 Test 3: Comptage des documents');
    let totalDocuments = 0;
    const collectionCounts = {};
    
    for (const collectionName of collections) {
      try {
        const snapshot = await db.collection(collectionName).get();
        const count = snapshot.size;
        collectionCounts[collectionName] = count;
        totalDocuments += count;
        console.log(`   ${collectionName}: ${count} documents`);
      } catch (error) {
        console.log(`   ${collectionName}: Erreur - ${error.message}`);
        collectionCounts[collectionName] = 0;
      }
    }
    
    console.log(`\n📊 Résumé: ${totalDocuments} documents au total`);
    
    if (totalDocuments > 0) {
      console.log('\n🎉 SUCCÈS: Connexion établie et données détectées !');
      console.log('✅ Vous pouvez maintenant lancer la sauvegarde avec: node backup-firestore.js');
    } else {
      console.log('\n⚠️  ATTENTION: Aucune donnée détectée');
      console.log('💡 Vérifiez que vous êtes connecté au bon projet Firebase');
    }
    
    return {
      success: true,
      totalDocuments,
      collectionCounts
    };
    
  } catch (error) {
    console.error('\n💥 ERREUR: Échec de la connexion');
    console.error('Détails:', error.message);
    
    console.log('\n🔧 Solutions possibles:');
    console.log('   1. Vérifiez votre clé de service Firebase');
    console.log('   2. Vérifiez que le projectId est correct');
    console.log('   3. Vérifiez que vous avez les permissions nécessaires');
    console.log('   4. Vérifiez votre connexion internet');
    console.log('   5. Essayez de vous reconnecter avec: firebase login');
    
    return {
      success: false,
      error: error.message
    };
  }
}

// Exécuter le test
if (require.main === module) {
  testConnection()
    .then((result) => {
      if (result.success) {
        console.log('\n✨ Test terminé avec succès !');
        process.exit(0);
      } else {
        console.log('\n💥 Test échoué');
        process.exit(1);
      }
    })
    .catch((error) => {
      console.error('\n💥 Erreur inattendue:', error);
      process.exit(1);
    });
}

module.exports = { testConnection };
