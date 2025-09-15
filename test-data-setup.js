#!/usr/bin/env node

/**
 * Script pour ajouter des données de test dans l'émulateur Firestore
 * Utilisez ce script pour tester vos sauvegardes
 */

const admin = require('firebase-admin');

// Configuration pour l'émulateur local
process.env.FIRESTORE_EMULATOR_HOST = 'localhost:9090';

// Initialiser Firebase Admin (sans clé de service pour l'émulateur)
admin.initializeApp({
  projectId: 'demo-project' // Utilisé par l'émulateur
});

const db = admin.firestore();

/**
 * Ajouter des données de test
 */
async function addTestData() {
  console.log('🧪 Ajout de données de test dans l\'émulateur...');
  
  try {
    // 1. Ajouter un utilisateur de test
    const userRef = db.collection('users').doc('test-user-1');
    await userRef.set({
      email: 'test@example.com',
      firstName: 'Jean',
      lastName: 'Dupont',
      phone: '0123456789',
      address: '123 Rue de Test',
      role: 'user',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log('✅ Utilisateur de test ajouté');

    // 2. Ajouter un animal de test
    const animalRef = db.collection('animals').doc('test-animal-1');
    await animalRef.set({
      name: 'Rex',
      species: 'chien',
      breed: 'Labrador',
      age: 3,
      userId: 'test-user-1',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log('✅ Animal de test ajouté');

    // 3. Ajouter un rendez-vous de test
    const appointmentRef = db.collection('appointments').doc('test-appointment-1');
    await appointmentRef.set({
      userId: 'test-user-1',
      animalId: 'test-animal-1',
      date: '2024-01-20',
      time: '14:00',
      status: 'confirmed',
      notes: 'Consultation de routine',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log('✅ Rendez-vous de test ajouté');

    // 4. Ajouter un créneau horaire de test
    const timeSlotRef = db.collection('timeSlots').doc('test-slot-1');
    await timeSlotRef.set({
      date: '2024-01-20',
      time: '14:00',
      available: false,
      appointmentId: 'test-appointment-1',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log('✅ Créneau horaire de test ajouté');

    // 5. Ajouter un message de contact de test
    const contactRef = db.collection('contact_messages').doc('test-message-1');
    await contactRef.set({
      name: 'Marie Martin',
      email: 'marie@example.com',
      phone: '0987654321',
      message: 'Bonjour, j\'aimerais prendre rendez-vous pour mon chat.',
      userId: 'test-user-1',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log('✅ Message de contact de test ajouté');

    // 6. Ajouter un article de blog de test
    const blogRef = db.collection('blog_posts').doc('test-blog-1');
    await blogRef.set({
      title: 'Les bienfaits de l\'ostéopathie pour les animaux',
      content: 'L\'ostéopathie animale est une pratique...',
      author: 'Admin',
      published: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log('✅ Article de blog de test ajouté');

    // 7. Ajouter un service de test
    const serviceRef = db.collection('services').doc('test-service-1');
    await serviceRef.set({
      name: 'Consultation ostéopathique',
      description: 'Consultation complète pour votre animal',
      price: 60,
      duration: 60,
      active: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log('✅ Service de test ajouté');

    // 8. Ajouter une annotation corporelle de test
    const annotationRef = db.collection('bodyAnnotations').doc('test-annotation-1');
    await annotationRef.set({
      userId: 'test-user-1',
      animalId: 'test-animal-1',
      bodyPart: 'épaule',
      notes: 'Douleur légère constatée',
      coordinates: { x: 100, y: 150 },
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log('✅ Annotation corporelle de test ajoutée');

    // 9. Ajouter une notification admin de test
    const notificationRef = db.collection('admin_notifications').doc('test-notification-1');
    await notificationRef.set({
      title: 'Nouveau message de contact',
      message: 'Un nouveau message a été reçu',
      type: 'contact',
      read: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log('✅ Notification admin de test ajoutée');

    console.log('\n🎉 Toutes les données de test ont été ajoutées !');
    console.log('📊 Résumé :');
    console.log('   - 1 utilisateur');
    console.log('   - 1 animal');
    console.log('   - 1 rendez-vous');
    console.log('   - 1 créneau horaire');
    console.log('   - 1 message de contact');
    console.log('   - 1 article de blog');
    console.log('   - 1 service');
    console.log('   - 1 annotation corporelle');
    console.log('   - 1 notification admin');
    
    return true;
  } catch (error) {
    console.error('❌ Erreur lors de l\'ajout des données de test:', error);
    return false;
  }
}

/**
 * Vérifier les données existantes
 */
async function checkExistingData() {
  console.log('🔍 Vérification des données existantes...');
  
  const collections = [
    'users', 'animals', 'appointments', 'timeSlots', 
    'contact_messages', 'blog_posts', 'services', 
    'bodyAnnotations', 'admin_notifications'
  ];
  
  for (const collectionName of collections) {
    try {
      const snapshot = await db.collection(collectionName).get();
      console.log(`   ${collectionName}: ${snapshot.size} documents`);
    } catch (error) {
      console.log(`   ${collectionName}: Erreur - ${error.message}`);
    }
  }
}

// Exécuter le script
async function main() {
  console.log('🚀 Script de test des données Firestore\n');
  
  // Vérifier d'abord les données existantes
  await checkExistingData();
  console.log('');
  
  // Ajouter des données de test
  const success = await addTestData();
  
  if (success) {
    console.log('\n✅ Vous pouvez maintenant tester vos scripts de sauvegarde !');
    console.log('💡 Commandes à essayer :');
    console.log('   - node backup-firestore.js');
    console.log('   - firebase emulators:export ./backups/test-export');
  }
  
  process.exit(success ? 0 : 1);
}

if (require.main === module) {
  main();
}

module.exports = { addTestData, checkExistingData };
