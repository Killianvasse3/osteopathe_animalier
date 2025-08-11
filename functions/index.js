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
