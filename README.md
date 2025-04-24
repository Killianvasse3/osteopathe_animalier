<div id="top"></div>
<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->



<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]



<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://osteopatheanimalier-50728.web.app">
    <img src="vue-app/images/logo_emmy.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Application Ostéopathe Animalier</h3>

  <p align="center">
    Une application web pour la gestion des rendez-vous et le suivi des animaux pour les ostéopathes animaliers
    <br />
    <a href="https://osteopatheanimalier-50728.web.app"><strong>Voir l'application »</strong></a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table des matières</summary>
  <ol>
    <li>
      <a href="#a-propos-du-projet">À propos du projet</a>
      <ul>
        <li><a href="#technologies-utilisees">Technologies utilisées</a></li>
      </ul>
    </li>
    <li>
      <a href="#demarrage">Démarrage</a>
      <ul>
        <li><a href="#prerequis">Prérequis</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#utilisation">Utilisation</a></li>
    <li><a href="#feuille-de-route">Feuille de route</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## À propos du projet

Cette application web est conçue pour les ostéopathes animaliers, leur permettant de :
* Gérer leurs rendez-vous avec les propriétaires d'animaux
* Suivre l'historique médical des animaux traités
* Envoyer des confirmations automatiques par email
* Gérer leur agenda professionnel

### Technologies utilisées

* [Firebase](https://firebase.google.com/)
  * Firestore (Base de données)
  * Authentication
  * Hosting
  * Cloud Functions
* [Node.js](https://nodejs.org/)
* HTML5 / CSS3 / JavaScript

## Démarrage

Pour installer et exécuter ce projet localement, suivez ces étapes.

### Prérequis

* Node.js et npm
  ```sh
  npm install npm@latest -g
  ```
* Firebase CLI
  ```sh
  npm install -g firebase-tools
  ```

### Installation

1. Clonez le dépôt
   ```sh
   git clone https://github.com/votre_nom/osteopathe_animalier.git
   ```
2. Installez les dépendances des Cloud Functions
   ```sh
   cd functions
   npm install
   ```
3. Créez un fichier `.env` dans le dossier functions avec vos identifiants Firebase
   ```
   FIREBASE_PROJECT_ID=votre_project_id
   FIREBASE_PRIVATE_KEY=votre_private_key
   FIREBASE_CLIENT_EMAIL=votre_client_email
   ```

## Utilisation

### Développement local

1. Démarrez les émulateurs Firebase
   ```sh
   firebase emulators:start
   ```

2. Accédez à l'application via votre navigateur
   ```
   http://localhost:5000
   ```

### Déploiement

Pour déployer l'application :

```sh
firebase deploy
```

## Feuille de route

- [ ] Système d'authentification
- [ ] Gestion des fiches animaux
- [ ] Système de rendez-vous
- [ ] Notifications par email
- [ ] Calendrier interactif
- [ ] Interface d'administration
- [ ] Système de facturation
- [ ] Application mobile

## Contact

Killian Vasse - Killian.vasse@gmail.com

Lien du projet : [https://github.com/votre_nom/osteopathe_animalier](https://github.com/votre_nom/osteopathe_animalier)

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/othneildrew/Best-README-Template.svg?style=for-the-badge
[contributors-url]: https://github.com/othneildrew/Best-README-Template/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/othneildrew/Best-README-Template.svg?style=for-the-badge
[forks-url]: https://github.com/othneildrew/Best-README-Template/network/members
[stars-shield]: https://img.shields.io/github/stars/othneildrew/Best-README-Template.svg?style=for-the-badge
[stars-url]: https://github.com/othneildrew/Best-README-Template/stargazers
[issues-shield]: https://img.shields.io/github/issues/othneildrew/Best-README-Template.svg?style=for-the-badge
[issues-url]: https://github.com/othneildrew/Best-README-Template/issues
[license-shield]: https://img.shields.io/github/license/othneildrew/Best-README-Template.svg?style=for-the-badge
[license-url]: https://github.com/othneildrew/Best-README-Template/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/killian-vasse
