# WebProject
Pense-bete WEB-Project
Application web pense-bete avec une architecture separee frontend/backend.

Structure du projet
front/ : interface utilisateur (frontend)
back/ : API et logique metier (backend Laravel)
Prerequis
Node.js + npm
PHP >= 8.1
Composer
Base de donnees (MySQL ou autre compatible Laravel)
Installation
1) Backend
Aller dans back/
Installer les dependances :
composer install
Copier l'environnement :
dupliquer .env.example en .env
Generer la cle :
php artisan key:generate
Configurer la base de donnees dans .env
Lancer les migrations :
php artisan migrate
Demarrer le serveur :
php artisan serve
2) Frontend
Aller dans front/
Installer les dependances :
npm install
Demarrer en dev :
npm run dev
Lancement
Backend : via php artisan serve
Frontend : via npm run dev
Ouvrir l'URL affichee par Vite (frontend) dans le navigateur.
Scripts utiles
Frontend
npm run dev : demarrage local
npm run build : build production
npm run preview : previsualiser le build
Backend
php artisan serve : serveur local
php artisan migrate : appliquer les migrations
php artisan test : lancer les tests
Notes
Verifier les CORS si front et back tournent sur des ports differents.
Ne pas versionner les secrets du fichier .env.