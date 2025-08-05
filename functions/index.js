/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// Fonction de test simple
exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});

// Fonction qui se déclenche quand un nouveau rendez-vous est créé
exports.onAppointmentCreated = functions.firestore
  .document('appointments/{appointmentId}')
  .onCreate(async (snap, context) => {
    const appointmentData = snap.data();
    const appointmentId = context.params.appointmentId;
    
    console.log(`[onAppointmentCreated] Déclenchement pour le rendez-vous ${appointmentId}`);
    console.log(`[onAppointmentCreated] Données du rendez-vous:`, appointmentData);
    
    try {
      // 1. Marquer le créneau comme indisponible
      if (appointmentData.timeSlotId) {
        console.log(`[onAppointmentCreated] Mise à jour du créneau ${appointmentData.timeSlotId}`);
        await admin.firestore()
          .collection('timeSlots')
          .doc(appointmentData.timeSlotId)
          .update({
            unavailable: true,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
          });
        console.log(`[onAppointmentCreated] Créneau ${appointmentData.timeSlotId} marqué comme indisponible`);
      } else {
        console.log(`[onAppointmentCreated] Aucun timeSlotId trouvé dans les données`);
      }
      
      // 2. Si un animal est associé, mettre à jour son historique
      if (appointmentData.animalId) {
        console.log(`[onAppointmentCreated] Mise à jour de l'historique de l'animal ${appointmentData.animalId}`);
        await admin.firestore()
          .collection('animals')
          .doc(appointmentData.animalId)
          .update({
            appointments: admin.firestore.FieldValue.arrayUnion({
              id: appointmentId,
              date: appointmentData.date,
              time: appointmentData.time,
              notes: appointmentData.notes || '',
              travelTime: appointmentData.travelTime || ''
            })
          });
        console.log(`[onAppointmentCreated] Historique de l'animal ${appointmentData.animalId} mis à jour`);
      } else {
        console.log(`[onAppointmentCreated] Aucun animalId trouvé dans les données`);
      }
      
      console.log(`[onAppointmentCreated] Rendez-vous ${appointmentId} traité avec succès`);
    } catch (error) {
      console.error(`[onAppointmentCreated] Erreur lors du traitement du rendez-vous ${appointmentId}:`, error);
      throw error;
    }
  });
