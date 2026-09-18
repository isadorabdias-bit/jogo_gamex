const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('../config/database');
const { JWT_SECRET } = require('../middleware/authMiddleware');

/**
 * Cadastro de Novo Usuário (Aluno ou Professor)
 */
function register(req, res) {
  try {
    const { name, email, password, role = 'aluno', avatar = 'robot', grade = '7º Ano' } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Por favor, preencha nome, email e senha.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'A senha deve conter no mínimo 6 caracteres.' });
    }

    // Verifica se o email já existe
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) {
      return res.status(400).json({ error: 'Este e-mail já está cadastrado.' });
    }

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);

    const insert = db.prepare(`
      INSERT INTO users (name, email, password_hash, role, avatar, grade, xp, level, coins)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = insert.run(
      name.trim(),
      email.trim().toLowerCase(),
      passwordHash,
      role === 'professor' ? 'professor' : 'aluno',
      avatar,
      grade,
      0, // XP inicial
      1, // Nível inicial
      50 // Moedas iniciais de boas-vindas
    );

    const userId = Number(result.lastInsertRowid);

    // Se for aluno, inicializa as 6 fases da trilha (fase 1 desbloqueada, restantes bloqueadas)
    if (role !== 'professor') {
      const initTrack = db.prepare(`
        INSERT INTO learning_track (user_id, stage_id, stars, status, best_score)
        VALUES (?, ?, 0, ?, 0)
      `);

      for (let stage = 1; stage <= 6; stage++) {
        initTrack.run(userId, stage, stage === 1 ? 'unlocked' : 'locked');
      }
    }

    const token = jwt.sign({ id: userId, role }, JWT_SECRET, { expiresIn: '7d' });

    const user = db.prepare('SELECT id, name, email, role, avatar, grade, bio, xp, level, coins FROM users WHERE id = ?').get(userId);

    return res.status(201).json({
      message: 'Cadastro realizado com sucesso!',
      token,
      user
    });
  } catch (error) {
    console.error('Erro no cadastro:', error);
    return res.status(500).json({ error: 'Erro interno ao realizar cadastro.' });
  }
}

/**
 * Login de Usuário
 */
function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.trim().toLowerCase());
    if (!user) {
      return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
    }

    const match = bcrypt.compareSync(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      grade: user.grade,
      bio: user.bio,
      xp: user.xp,
      level: user.level,
      coins: user.coins
    };

    return res.json({
      message: 'Login realizado com sucesso!',
      token,
      user: safeUser
    });
  } catch (error) {
    console.error('Erro no login:', error);
    return res.status(500).json({ error: 'Erro interno ao realizar login.' });
  }
}

/**
 * Retorna dados do usuário autenticado (Sessão Persistente)
 */
function getMe(req, res) {
  return res.json({ user: req.user });
}

/**
 * Atualização de Perfil (Nome, Avatar, Bio, Série)
 */
function updateProfile(req, res) {
  try {
    const { name, avatar, bio, grade } = req.body;
    const userId = req.user.id;

    const update = db.prepare(`
      UPDATE users 
      SET name = COALESCE(?, name),
          avatar = COALESCE(?, avatar),
          bio = COALESCE(?, bio),
          grade = COALESCE(?, grade)
      WHERE id = ?
    `);

    update.run(name ? name.trim() : null, avatar || null, bio !== undefined ? bio : null, grade || null, userId);

    const updatedUser = db.prepare('SELECT id, name, email, role, avatar, grade, bio, xp, level, coins FROM users WHERE id = ?').get(userId);

    return res.json({
      message: 'Perfil atualizado com sucesso!',
      user: updatedUser
    });
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    return res.status(500).json({ error: 'Erro interno ao atualizar perfil.' });
  }
}

module.exports = {
  register,
  login,
  getMe,
  updateProfile
};
