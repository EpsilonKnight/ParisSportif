import express from 'express';
import {MongoClient} from 'mongodb';
import bcrypt from 'bcrypt';
//Il faut installer le middleware express-session ensuite on l'import
import cookieParser from 'cookie-parser';

const router = express.Router()

//Connexion a la base de données
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true})

async function connectToDatabase() {
    try {
        await client.connect();
        console.log("Connecté à la base de données MongoDB avec succès !");
    } catch (error) {
        console.error("Erreur lors de la connexion à la base de données MongoDB :", error);
    }
}
connectToDatabase();

//Ajouter le middleware cookie-parser à notre appli
router.use(cookieParser());


//Route pour afficher e fomulaire d'identification connexion
router.get('/', (req,res) => {
    res.render('login');
});

router.post('/', async (req, res) =>{
    const { email , password} = req.body;

    //Verifier si l'utilisateur existe dans la base de données
    const database = client.db("ApiFoot");
    const collection = database.collection('USER');
    const user = await collection.findOne({email});

    if (!user){
        //Utilisateur n'existe pas
        return res.status(401).send('Email ou mdp incorrect')
    }

    //Verifier le mot de passe 
    const passwordMatch = await bcrypt.compare(password , user.password );

    if (!passwordMatch){
        //Le mot de passe n'est pas le bon
        return res.status(401).send('Email ou mot de passe incorrect');
    }

     // Authentification réussie, définir un cookie avec les informations de l'utilisateur
     res.cookie('user', JSON.stringify({ email: user.email, prenom: user.prenom }), { maxAge: 900000, httpOnly: true });
     console.log (res.cookie('user', JSON.stringify({ email: user.email, prenom: user.prenom }), { maxAge: 900000, httpOnly: true }));
    //Rediriger l'user vers la page souhaité
    res.redirect('/matchData');

})



export default router;