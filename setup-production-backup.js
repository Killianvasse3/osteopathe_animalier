#!/usr/bin/env node

/**
 * Script de configuration pour la sauvegarde de production
 * Ce script vous guide pour configurer la sauvegarde avec vos vraies données
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Configuration de la sauvegarde de production\n');

// Vérifier si Firebase CLI est installé
const { execSync } = require('child_process');

try {
  const firebaseVersion = execSync('firebase --version', { encoding: 'utf8' });
  console.log(`✅ Firebase CLI installé: ${firebaseVersion.trim()}`);
} catch (error) {
  console.log('❌ Firebase CLI non trouvé. Installez-le avec: npm install -g firebase-tools');
  process.exit(1);
}

// Vérifier la configuration Firebase
try {
  const firebaseConfig = execSync('firebase projects:list', { encoding: 'utf8' });
  console.log('✅ Configuration Firebase détectée');
  console.log('📋 Projets disponibles:');
  console.log(firebaseConfig);
} catch (error) {
  console.log('⚠️  Configuration Firebase non trouvée. Connectez-vous avec: firebase login');
}

console.log('\n📝 Instructions pour configurer la sauvegarde:\n');

console.log('1️⃣  TÉLÉCHARGER LA CLÉ DE SERVICE:');
console.log('   - Allez sur: https://console.firebase.google.com/');
console.log('   - Sélectionnez votre projet: osteopatheanimalier-50728');
console.log('   - Allez dans "Paramètres du projet" > "Comptes de service"');
console.log('   - Cliquez sur "Générer une nouvelle clé privée"');
console.log('   - Téléchargez le fichier JSON');
console.log('   - Renommez-le: serviceAccountKey.json');
console.log('   - Placez-le dans le dossier: ./config/\n');

console.log('2️⃣  CRÉER LE DOSSIER DE CONFIGURATION:');
if (!fs.existsSync('./config')) {
  fs.mkdirSync('./config');
  console.log('✅ Dossier ./config créé');
} else {
  console.log('✅ Dossier ./config existe déjà');
}

console.log('\n3️⃣  CONFIGURER LE SCRIPT DE SAUVEGARDE:');
console.log('   - Ouvrez: backup-firestore.js');
console.log('   - Décommentez les lignes de la clé de service');
console.log('   - Modifiez le chemin vers votre clé: ./config/serviceAccountKey.json');
console.log('   - Modifiez le projectId: osteopatheanimalier-50728\n');

console.log('4️⃣  TESTER LA CONNEXION:');
console.log('   - Exécutez: node test-connection.js\n');

console.log('5️⃣  LANCER LA SAUVEGARDE:');
console.log('   - Exécutez: node backup-firestore.js\n');

console.log('⚠️  SÉCURITÉ:');
console.log('   - Ne commitez JAMAIS votre clé de service dans Git');
console.log('   - Ajoutez ./config/ à votre .gitignore');
console.log('   - Gardez votre clé de service sécurisée\n');

// Créer un fichier .gitignore pour la sécurité
const gitignoreContent = `
# Clés de service Firebase
config/
serviceAccountKey.json
*.json
!package*.json
!firebase.json
!firestore.rules
!firestore.indexes.json

# Sauvegardes
backups/
*.backup
`;

if (!fs.existsSync('.gitignore')) {
  fs.writeFileSync('.gitignore', gitignoreContent);
  console.log('✅ Fichier .gitignore créé pour la sécurité');
} else {
  console.log('✅ Fichier .gitignore existe déjà');
}

console.log('\n🎯 Prochaines étapes:');
console.log('   1. Téléchargez votre clé de service');
console.log('   2. Configurez backup-firestore.js');
console.log('   3. Testez avec: node test-connection.js');
console.log('   4. Lancez la sauvegarde: node backup-firestore.js');
