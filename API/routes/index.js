// Router principale che gestisce tutte le route API
const express = require('express');
const router = express.Router();

// Importa tutte le route specifiche
const userRoutes = require("./user");
const projectRoutes = require('./project');
const issueRoutes = require('./issue');
const commentRoutes = require('./comment');


// Collega le route ai rispettivi path base
router.use('/users', userRoutes);       
router.use('/projects', projectRoutes); 
router.use('/issues', issueRoutes);     
router.use('/comments', commentRoutes); 

// Esporta il router per usarlo in app.js
module.exports = router;