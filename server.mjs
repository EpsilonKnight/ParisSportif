import express from 'express';
import ejs from 'ejs';
import { config } from 'dotenv';
import bodyParser from 'body-parser'; // Importez bodyParser depuis le module body-parser

import currentMatch from './currentMatch.js';
import createUser from './createUser.js';

config();
const app = express();
const port = 3000;

// Utilisez bodyParser pour analyser les données du formulaire
//Cela permet à la route createUser de recevoir correctement les données envoyées depuis le formulaire
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configuration du moteur de modèle EJS
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Définition des routes
app.use('/matchData', currentMatch);
app.use('/createUser', createUser);

// Démarrage du serveur
app.listen(port, () => {
    console.log(`Serveur en cours d'exécution sur http://localhost:${port}`);
});

