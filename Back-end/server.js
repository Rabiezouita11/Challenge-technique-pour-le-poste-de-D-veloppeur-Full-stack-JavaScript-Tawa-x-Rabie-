const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const articleRoutes = require('./Routes/articleRoutes');
var cookieParser = require('cookie-parser');
const authRoutes = require("./Routes/auth.js");
const { validateUserRegistration } = require("./Middleware/validation.js");
// Configuration des variables d'environnement à partir du fichier .env
dotenv.config();
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
    cors({
        origin: ['http://localhost:8080', 'http://localhost:4200'],
        credentials: true,
    })
);
app.use(express.json());

// Updated code to use .env variable
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on('connected', () => {
    console.log('Connected to database');
});

mongoose.connection.on('error', (err) => {
    console.error('Error connecting to database:', err);
});

// Configuration de la route principale du backend
app.get('/', (req, res) => {
    res.send("Backend de l'application est en cours de fonctionnement.");
});

//  Configuration des routes pour les fonctionnalités d'authentification
// Register validation middleware
app.use("/api/user/register", validateUserRegistration);
// Register user registration route
app.use("/api/user", authRoutes);







app.use('/api', articleRoutes); // You can replace '/api' with any base route you want



// Définition des autres routes pour les fonctionnalités de l'application (inscription, connexion, gestion des articles, etc.)
// Ces routes seront implémentées dans des fichiers séparés pour une meilleure organisation du code.

// Démarrage du serveur
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Le serveur backend est en cours d'écoute sur le port ${port}.`);
});
