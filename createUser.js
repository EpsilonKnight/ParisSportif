// const { MongoClient, ServerApiVersion} = require('mongodb');  Ca ne marche pas car dans un module on ne peux faire de require() uniquement des import ci dessous
import { MongoClient, ServerApiVersion } from 'mongodb';
//si on utilise le .env pour des données sensible, bien faire attention a importer dotenv pour faire fonctionner 
//cela a permit la resolution du probleme mongoclient{uri} => process.env.MONGO_URI
import { config } from 'dotenv';
import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
// Load environment variables from .env
const router = express.Router();
config();
const uri = process.env.MONGO_URI;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});


async function run() {
    try {
        // Connecter le client au serveur MongoDB
        await client.connect();
        console.log("Connecté à MongoDB avec succès!");
    } catch (error) {
        console.error("Erreur lors de la connexion à MongoDB :", error);
    }
}
run().catch(console.dir);


// Route pour afficher le formulaire d'inscription
router.get('/', (req, res) => {
    res.render('createUser');
});


// Route pour traiter la soumission du formulaire d'inscription
router.post('/', async (req, res) => {
    console.log('Données reçues dans la requête :', req.body);
    const { email, password, prenom } = req.body;
    const database = client.db("ApiFoot");
    const collection = database.collection("USER");
    try {
        //Verrifier si l'utilisateur existe dans la base de données
        const existingUser = await collection.findOne({ email });
        if (existingUser) {
            return res.status(400).send('Un utilisateur avec cet email existe deja.')
        }

        //Hashage du mdp
        const hashedPassword = await bcrypt.hash(password, 10)
        // Insérer les données soumises dans la collection USER
        const newUser = { email , password : hashedPassword , prenom};
        const result = await collection.insertOne(newUser);

        console.log('Nouvel utilisateur créé :', newUser);
        // res.send('Utilisateur créé avec succès !');

        //Générer un jeton JWT
        const token = jwt.sign({email} , process.env.JWT_SECRET, {expiresIn: '1h'})

        //Envoyer le jeton dans la reponse res
        res.cookie('jwt' , token , {httpOnly: true, secure: true});
        // res.status(500).send('Utilisateur créé avec succès ! Jeton JWT envoyé dans le cookie.');
        res.redirect('/login')
    } catch (error) {
        console.error("Erreur lors de la création de l'utilisateur :", error);
        res.status(500).send('Une erreur est survenue lors de la création de l\'utilisateur');
    }
});


export default router;
