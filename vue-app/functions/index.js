const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const cors = require('cors')({origin: true});
require('dotenv').config();

admin.initializeApp();

// Configuration de SendGrid
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'Killian.vasse@gmail.com',
        pass: 'thli khmu jrjm ecwy' // Mot de passe d'application Gmail
    }
});

exports.sendAppointmentEmails = functions.https.onCall(async (data, context) => {
    const { appointment, osteopathEmail: osteopathEmailAddress } = data;

    // Email pour le client
    const clientEmail = {
        from: 'Killian.vasse@gmail.com',
        to: appointment.userEmail,
        subject: 'Confirmation de votre rendez-vous - Ostéopathe Animalier',
        html: `
            <h2>Confirmation de votre rendez-vous</h2>
            <p>Bonjour,</p>
            <p>Votre rendez-vous a été confirmé avec succès.</p>
            <h3>Détails du rendez-vous :</h3>
            <ul>
                <li>Date : ${appointment.date}</li>
                <li>Heure : ${appointment.time}</li>
                <li>Animal : ${appointment.animalName} (${appointment.animalType})</li>
            </ul>
            <p>Notes : ${appointment.notes || 'Aucune note'}</p>
            <p>Si vous souhaitez modifier ou annuler votre rendez-vous, veuillez nous contacter.</p>
            <p>Cordialement,<br>L'équipe Ostéopathe Animalier</p>
        `
    };

    // Email pour l'ostéopathe
    const osteopathNotification = {
        from: 'Killian.vasse@gmail.com',
        to: osteopathEmailAddress,
        subject: 'Nouveau rendez-vous - Ostéopathe Animalier',
        html: `
            <h2>Nouveau rendez-vous</h2>
            <h3>Détails du rendez-vous :</h3>
            <ul>
                <li>Date : ${appointment.date}</li>
                <li>Heure : ${appointment.time}</li>
                <li>Client : ${appointment.userEmail}</li>
                <li>Animal : ${appointment.animalName} (${appointment.animalType})</li>
            </ul>
            <p>Notes : ${appointment.notes || 'Aucune note'}</p>
        `
    };

    try {
        // Envoyer les emails
        await transporter.sendMail(clientEmail);
        await transporter.sendMail(osteopathNotification);
        return { success: true };
    } catch (error) {
        console.error('Erreur lors de l\'envoi des emails:', error);
        throw new functions.https.HttpsError('internal', 'Erreur lors de l\'envoi des emails');
    }
}); 