const jwt = require('jsonwebtoken');
const { db } = require('../config/database');

const JWT_SECRET = process.env.JWT_SECRET || 'mathplay_secret_key_2026_super_secure';

/**
 * Middleware para autenticar requisições via JWT
 */
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token de autenticação não fornecido.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // Busca os dados atualizados do usuário no banco
    const user = db.prepare('SELECT id, name, email, role, avatar, grade, bio, xp, level, coins FROM users WHERE id = ?').get(decoded.id);

    if (!user) {
      return res.status(401).json({ error: 'Usuário associado ao token não encontrado.' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Sessão expirada ou token inválido. Faça login novamente.' });
  }
}

/**
 * Middleware para exigir papel de professor/admin
 */
function requireTeacher(req, res, next) {
  if (req.user && req.user.role === 'professor') {
    return next();
  }
  return res.status(403).json({ error: 'Acesso negado. Apenas professores têm acesso a esta área.' });
}

module.exports = {
  authenticateToken,
  requireTeacher,
  JWT_SECRET
};
