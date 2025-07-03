// Impostazioni per la connessione al database MySQL
const config = {
    
    db: {
        host: "localhost",        
        user: "inuser",          
        password: "user!",       
        database: "issuenet",   
        connectTimeout: 60000    
    }
};

// Esporta la configurazione 
module.exports = config;    