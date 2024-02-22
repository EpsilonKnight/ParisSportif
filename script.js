// function fetchData() {
//     const apiUrl = "http://api.football-data.org/v4/competitions";
//     const apiKey = "43415bf0308949a7aada8dd6a57bf11d";
  
//     console.log('Avant la requête fetch');
  
//     fetch(apiUrl, {
//         headers: {
//             'X-Auth-Token' : apiKey
//         }
//     })
//       .then(response => {
//         console.log('Réponse de la requête fetch:', response);
  
//         // Vérifie si la requête a réussi (statut HTTP 200-299)
//         if (!response.ok) {
//           throw new Error(`Erreur HTTP! Statut: ${response.status}`);
//         }
//         // Convertit la réponse en JSON
//         return response.json();
//       })
//       .then(data => {
//         // Les données sont disponibles ici
//         console.log('Données récupérées:', data);
        
//         // Vous pouvez maintenant utiliser les données dans votre application
//       })
//       .catch(error => {
//         console.error('Erreur lors de la récupération des données:', error);
//       })
//       .finally(() => {
//         console.log('Fin de la requête fetch.');
//       });
//   }
  
//   // Appel de la fonction pour récupérer des données
//   fetchData();


  import fetch from 'node-fetch';

const apiKey = "43415bf0308949a7aada8dd6a57bf11d";
const competitionId = 2015;

// Récupérer les détails de la compétition
const competitionUrl = `http://api.football-data.org/v4/competitions/${competitionId}`;
const matchesUrl = `http://api.football-data.org/v4/competitions/${competitionId}/matches`;

async function fetchData() {
  try {
    // Récupérer les détails de la compétition
    const competitionResponse = await fetch(competitionUrl, {
      headers: {
        'X-Auth-Token': apiKey
      }
    });
    const competitionData = await competitionResponse.json();
    console.log('Détails de la compétition:', competitionData);

    // Récupérer la liste des matchs
    const matchesResponse = await fetch(matchesUrl, {
      headers: {
        'X-Auth-Token': apiKey
      }
    });
    const matchesData = await matchesResponse.json();
    console.log('Liste des matchs:', matchesData);

  } catch (error) {
    console.error('Erreur lors de la récupération des données:', error);
  }
}

// Appel de la fonction pour récupérer des données
fetchData();