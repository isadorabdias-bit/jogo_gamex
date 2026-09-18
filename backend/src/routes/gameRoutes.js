const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Buscar questões para uma partida (requer autenticação)
router.get('/questions', authenticateToken, gameController.getQuestions);

// Salvar resultado de uma partida e processar gamificação
router.post('/save-session', authenticateToken, gameController.saveSession);

module.exports = router;
