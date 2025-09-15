#!/usr/bin/env node

/**
 * Script de test complet pour les sauvegardes Firestore
 */

const { addTestData, checkExistingData } = require('./test-data-setup');
const { backupFirestore } = require('./backup-firestore');

async function testBackupProcess() {
  console.log('🧪 Test complet du processus de sauvegarde\n');
  
  try {
    // 1. Vérifier l'état initial
    console.log('📋 Étape 1: Vérification de l\'état initial');
    await checkExistingData();
    console.log('');
    
    // 2. Ajouter des données de test
    console.log('📋 Étape 2: Ajout de données de test');
    const dataAdded = await addTestData();
    if (!dataAdded) {
      throw new Error('Échec de l\'ajout des données de test');
    }
    console.log('');
    
    // 3. Vérifier que les données ont été ajoutées
    console.log('📋 Étape 3: Vérification après ajout');
    await checkExistingData();
    console.log('');
    
    // 4. Effectuer la sauvegarde
    console.log('📋 Étape 4: Sauvegarde des données');
    const backupDir = await backupFirestore();
    console.log('');
    
    // 5. Vérifier le résultat
    console.log('📋 Étape 5: Vérification de la sauvegarde');
    const fs = require('fs');
    const path = require('path');
    
    const backupFile = path.join(backupDir, 'firestore-backup.json');
    const metadataFile = path.join(backupDir, 'metadata.json');
    
    if (fs.existsSync(backupFile) && fs.existsSync(metadataFile)) {
      const backupData = JSON.parse(fs.readFileSync(backupFile, 'utf8'));
      const metadata = JSON.parse(fs.readFileSync(metadataFile, 'utf8'));
      
      console.log('✅ Fichiers de sauvegarde créés avec succès');
      console.log(`📊 Métadonnées: ${metadata.totalDocuments} documents dans ${metadata.totalCollections} collections`);
      
      // Vérifier que les données ne sont pas vides
      if (metadata.totalDocuments > 0) {
        console.log('🎉 SUCCÈS: La sauvegarde contient des données !');
        console.log('📁 Détail des collections:');
        Object.entries(metadata.collections).forEach(([name, count]) => {
          if (count > 0) {
            console.log(`   - ${name}: ${count} documents`);
          }
        });
      } else {
        console.log('⚠️  ATTENTION: La sauvegarde est vide');
      }
    } else {
      console.log('❌ ERREUR: Fichiers de sauvegarde non trouvés');
    }
    
  } catch (error) {
    console.error('💥 Erreur lors du test:', error);
    process.exit(1);
  }
}

// Exécuter le test
if (require.main === module) {
  testBackupProcess()
    .then(() => {
      console.log('\n✨ Test terminé avec succès !');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Test échoué:', error);
      process.exit(1);
    });
}

module.exports = { testBackupProcess };
