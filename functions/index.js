const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

// Fonction de test simple
exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});

// Fonction pour supprimer un compte d'authentification Firebase
exports.deleteUserAccount = functions.https.onCall(async (data, context) => {
  // Vérifier que l'utilisateur est authentifié et est admin
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Utilisateur non authentifié');
  }
  
  // Vérifier que l'utilisateur est admin
  const userDoc = await admin.firestore().collection('users').doc(context.auth.uid).get();
  if (!userDoc.exists || userDoc.data().role !== 'admin') {
    throw new functions.https.HttpsError('permission-denied', 'Accès refusé - Administrateur requis');
  }
  
  const { userId } = data;
  if (!userId) {
    throw new functions.https.HttpsError('invalid-argument', 'userId requis');
  }
  
  try {
    // Supprimer le compte d'authentification Firebase
    await admin.auth().deleteUser(userId);
    console.log(`[deleteUserAccount] Compte d'authentification supprimé pour l'utilisateur ${userId}`);
    
    return { success: true, message: 'Compte d\'authentification supprimé avec succès' };
  } catch (error) {
    console.error(`[deleteUserAccount] Erreur lors de la suppression du compte ${userId}:`, error);
    throw new functions.https.HttpsError('internal', 'Erreur lors de la suppression du compte d\'authentification');
  }
});

// Fonction pour créer un utilisateur avec le SDK Admin Firebase
exports.createUserAccount = functions.https.onCall(async (data, context) => {
  // Vérifier que l'utilisateur est authentifié et est admin
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Utilisateur non authentifié');
  }
  
  // Vérifier que l'utilisateur est admin
  const userDoc = await admin.firestore().collection('users').doc(context.auth.uid).get();
  if (!userDoc.exists || userDoc.data().role !== 'admin') {
    throw new functions.https.HttpsError('permission-denied', 'Accès refusé - Administrateur requis');
  }
  
  const { email, password, firstName, lastName, phone, address, travelTime } = data;
  
  // Validation des données
  if (!email || !password || !firstName || !lastName || !phone || !address) {
    throw new functions.https.HttpsError('invalid-argument', 'Tous les champs obligatoires doivent être remplis');
  }
  
  if (password.length < 6) {
    throw new functions.https.HttpsError('invalid-argument', 'Le mot de passe doit contenir au moins 6 caractères');
  }
  
  try {
    // Créer l'utilisateur avec le SDK Admin Firebase (pas de connexion automatique)
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
      displayName: `${firstName} ${lastName}`,
      emailVerified: false
    });
    
    // Créer le document utilisateur dans Firestore
    await admin.firestore().collection('users').doc(userRecord.uid).set({
      email: email,
      firstName: firstName,
      lastName: lastName,
      phone: phone,
      address: address,
      travelTime: travelTime || '',
      role: 'user',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    console.log(`[createUserAccount] Utilisateur créé avec succès: ${userRecord.uid}`);
    
    return { 
      success: true, 
      message: 'Utilisateur créé avec succès',
      userId: userRecord.uid,
      email: email
    };
  } catch (error) {
    console.error(`[createUserAccount] Erreur lors de la création de l'utilisateur:`, error);
    
    // Gérer les erreurs spécifiques
    if (error.code === 'auth/email-already-exists') {
      throw new functions.https.HttpsError('already-exists', 'Un compte avec cet email existe déjà');
    } else if (error.code === 'auth/invalid-email') {
      throw new functions.https.HttpsError('invalid-argument', 'Format d\'email invalide');
    } else if (error.code === 'auth/weak-password') {
      throw new functions.https.HttpsError('invalid-argument', 'Le mot de passe est trop faible');
    } else {
      throw new functions.https.HttpsError('internal', 'Erreur lors de la création de l\'utilisateur');
    }
  }
});
