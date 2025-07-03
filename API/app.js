// Importa le dipendenze necessarie
const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/index'); 

// Crea l'applicazione Express
const app = express();
const port = 3000;
const contexPath = '/api';

// Configura CORS per accettare richieste dal frontend Angular
app.use(cors({ origin: "http://localhost:4200" }));
app.use(express.json())
app.use(
    express.urlencoded({
        extended: true,
    })
);

// Usa tutte le route API tramite il router centralizzato
app.use(contexPath, apiRoutes);

// Route base per l'API 
app.get(contexPath, (req, res) => {
    res.json({
        message: 'IssueNet API is running!',
        version: '1.0.0',
        description: 'Bug tracking system API',
        endpoints: [
            `${contexPath}/users`,
            `${contexPath}/projects`,
            `${contexPath}/issues`,
            `${contexPath}/comments`
        ]
    });
});

// Route catch-all per richieste non gestite 
app.use((req, res) => {
    res.status(404);
    res.json({ 
        error: "Resource Not Found",
        message: `Endpoint ${req.method} ${req.path} not found`,
        availableEndpoints: [
            `${contexPath}/users`,
            `${contexPath}/projects`,
            `${contexPath}/issues`,
            `${contexPath}/comments`
        ]
    });
});

// Avvia il server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
    console.log(`API available at: http://localhost:${port}${contexPath}`);
    console.log(`Endpoints disponibili:`);
    console.log(`- GET  http://localhost:${port}${contexPath}/users`);
    console.log(`- GET  http://localhost:${port}${contexPath}/projects`);
    console.log(`- GET  http://localhost:${port}${contexPath}/issues`);
    console.log(`- GET  http://localhost:${port}${contexPath}/comments`);
});
