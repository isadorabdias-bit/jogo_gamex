const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');
const { authenticateToken, requireTeacher } = require('../middleware/authMiddleware');

// Dashboard do Aluno
router.get('/dashboard', authenticateToken, statsController.getDashboard);

// Ranking Geral de Alunos
router.get('/leaderboard', authenticateToken, statsController.getLeaderboard);

// Painel Pedagógico do Professor
router.get('/teacher', authenticateToken, requireTeacher, statsController.getTeacherOverview);

module.exports = router;
