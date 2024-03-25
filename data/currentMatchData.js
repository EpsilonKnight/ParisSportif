import express from 'express';
import fetch from 'node-fetch';
//installation de dotenv pour récupérer des données du .env
import { config } from 'dotenv';

const router = express.Router()
// Load environment variables from .env
config();

const apiKey = process.env.API_KEY;
// Utiliser la clé API comme nécessaire dans mon script
// console.log(apiKey);


router.get( '/' , async (req, res) => {

  // Récupérer les données utilisateur à partir du cookie
  const userData = req.cookies.user;
  if (!userData) {
    // Si le cookie n'est pas présent, rediriger l'utilisateur vers la page de connexion
    return res.redirect('/login');
}
  const user = JSON.parse(userData);
  console.log(user.prenom);
  

  const competitionId = 2015;
  const apiUrl = `http://api.football-data.org/v4/competitions/${competitionId}/matches?status=SCHEDULED`;
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
    //matches est un tableau 
    // console.log(data);
    const currentMatchday = data.matches[0].season.currentMatchday;
    console.log(currentMatchday);
    const matchesOfCurrentMatchday = data.matches.filter(match => match.matchday === currentMatchday);
  // pour voir le Json des match a venir
  res.json(matchesOfCurrentMatchday);
} catch (error) {
    console.error('Erreur lors de la récupération des données:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des données' });
  }
});

export default router;