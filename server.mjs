import express from 'express';
import fetch from 'node-fetch';
//installation de dotenv pour récupérer des données du .env
import { config } from 'dotenv';

// Load environment variables from .env
config();

const app = express();
const port = 3000;
// Recupération de la clé APi du .env
const apiKey = process.env.API_KEY;
// Utiliser la clé API comme nécessaire dans votre script
console.log(apiKey);


app.use(express.json());

app.use('/', async (req, res) => {
  

  const competitionId = 2015;
  const apiUrl = `http://api.football-data.org/v4/competitions/${competitionId}/matches?status=SCHEDULED&matchday=24`;
  try {
    const response = await fetch(apiUrl, {
      headers: {
        'X-Auth-Token': apiKey
      }
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP! Statut: ${response.status}`);
    }
    
    const data = await response.json();
 
  res.json(data);

  } catch (error) {
    console.error('Erreur lors de la récupération des données:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des données' });
  }
});

app.listen(port, () => {
  console.log(`Serveur en cours d'exécution sur http://localhost:${port}`);
});