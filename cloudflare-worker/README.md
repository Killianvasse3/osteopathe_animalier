# Worker de notifications Emmy Vasse

Ce Worker envoie les notifications OneSignal sans exposer la clé REST dans le navigateur.

## Déploiement

1. Créer un compte Cloudflare gratuit si nécessaire.
2. Depuis ce dossier, exécuter `npm install` puis `npx wrangler login`.
3. Enregistrer la nouvelle App API Key OneSignal avec `npx wrangler secret put ONESIGNAL_REST_API_KEY`.
4. Déployer avec `npm run deploy`.
5. Copier l'URL `https://...workers.dev` affichée par Wrangler.
6. Reporter cette URL dans `NOTIFICATION_WORKER_URL` dans `vue-app/index.html`.
7. Publier le frontend avec `firebase deploy --only hosting`.

La clé OneSignal ne doit jamais être écrite dans `wrangler.toml`, dans le code ou dans Git.
