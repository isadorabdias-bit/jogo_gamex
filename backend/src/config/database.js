const { DatabaseSync } = require('node:sqlite');
const path = require('node:path');
const fs = require('node:fs');

// Garante que o diretório de dados existe
const dbDir = path.join(__dirname, '..', '..', 'data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'mathplay.db');
const db = new DatabaseSync(dbPath);

// Ativa chaves estrangeiras
db.exec('PRAGMA foreign_keys = ON;');

/**
 * Inicialização das tabelas do banco de dados relacional
 */
function initDatabase() {
  db.exec(`
    -- Tabela de Usuários (Alunos e Professores)
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT CHECK(role IN ('aluno', 'professor')) NOT NULL DEFAULT 'aluno',
      avatar TEXT DEFAULT 'robot',
      grade TEXT DEFAULT '7º Ano',
      bio TEXT DEFAULT '',
      xp INTEGER DEFAULT 0,
      level INTEGER DEFAULT 1,
      coins INTEGER DEFAULT 50,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Tabela de Insígnias / Medalhas do Sistema
    CREATE TABLE IF NOT EXISTS badges (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      icon TEXT NOT NULL,
      category TEXT NOT NULL,
      req_type TEXT NOT NULL,
      req_val INTEGER NOT NULL
    );

    -- Tabela de Insígnias Desbloqueadas pelos Usuários
    CREATE TABLE IF NOT EXISTS user_badges (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      badge_id INTEGER NOT NULL,
      unlocked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (badge_id) REFERENCES badges(id) ON DELETE CASCADE,
      UNIQUE(user_id, badge_id)
    );

    -- Tabela de Sessões / Histórico de Partidas
    CREATE TABLE IF NOT EXISTS game_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      game_type TEXT NOT NULL, -- 'equacoes' ou 'fracoes'
      score INTEGER NOT NULL DEFAULT 0,
      correct_answers INTEGER NOT NULL DEFAULT 0,
      wrong_answers INTEGER NOT NULL DEFAULT 0,
      accuracy REAL NOT NULL DEFAULT 0.0,
      difficulty TEXT NOT NULL, -- 'facil', 'medio', 'dificil'
      xp_earned INTEGER NOT NULL DEFAULT 0,
      duration_seconds INTEGER NOT NULL DEFAULT 0,
      played_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Tabela de Progresso na Trilha de Aprendizagem
    CREATE TABLE IF NOT EXISTS learning_track (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      stage_id INTEGER NOT NULL, -- 1 a 6
      stars INTEGER NOT NULL DEFAULT 0,
      status TEXT CHECK(status IN ('locked', 'unlocked', 'completed')) NOT NULL DEFAULT 'locked',
      best_score INTEGER NOT NULL DEFAULT 0,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE(user_id, stage_id)
    );
  `);

  console.log('✅ Banco de dados SQLite inicializado com sucesso em:', dbPath);
}

module.exports = {
  db,
  initDatabase,
  dbPath
};
