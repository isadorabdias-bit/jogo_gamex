const bcrypt = require('bcryptjs');
const { db, initDatabase } = require('../config/database');

/**
 * Script de população de dados iniciais (Seeds)
 */
function seedDatabase() {
  initDatabase();

  console.log('🌱 Executando seeds no banco de dados...');

  // 1. Inserção de Insígnias / Medalhas Gamificadas
  const badges = [
    {
      code: 'first_step',
      name: 'Primeiro Passo',
      description: 'Concluiu sua primeira partida em qualquer jogo matemático!',
      icon: 'Rocket',
      category: 'Geral',
      req_type: 'total_games',
      req_val: 1
    },
    {
      code: 'equation_apprentice',
      name: 'Aprendiz das Equações',
      description: 'Acertou pelo menos 5 equações de 1º grau na Balança!',
      icon: 'Scale',
      category: 'Álgebra',
      req_type: 'equacoes_correct',
      req_val: 5
    },
    {
      code: 'equation_master',
      name: 'Mestre da Balança',
      description: 'Acertou 15 equações de 1º grau!',
      icon: 'Sparkles',
      category: 'Álgebra',
      req_type: 'equacoes_correct',
      req_val: 15
    },
    {
      code: 'pizza_chef',
      name: 'Chef das Frações',
      description: 'Acertou 5 desafios de frações visuais!',
      icon: 'PieChart',
      category: 'Aritmética',
      req_type: 'fracoes_correct',
      req_val: 5
    },
    {
      code: 'fraction_guru',
      name: 'Mago das Porcentagens',
      description: 'Acertou 15 desafios de frações e porcentagens!',
      icon: 'Percent',
      category: 'Aritmética',
      req_type: 'fracoes_correct',
      req_val: 15
    },
    {
      code: 'perfect_precision',
      name: 'Mira Perfeita',
      description: 'Terminou uma partida com 100% de acertos!',
      icon: 'Target',
      category: 'Precisão',
      req_type: 'perfect_accuracy',
      req_val: 1
    },
    {
      code: 'speedy_math',
      name: 'Relâmpago Matemático',
      description: 'Completou uma partida rápida em menos de 45 segundos!',
      icon: 'Zap',
      category: 'Velocidade',
      req_type: 'speed_run',
      req_val: 45
    },
    {
      code: 'level_5_hero',
      name: 'Explorador Nível 5',
      description: 'Evoluiu seu conhecimento e atingiu o Nível 5!',
      icon: 'Award',
      category: 'Evolução',
      req_type: 'reach_level',
      req_val: 5
    }
  ];

  const insertBadge = db.prepare(`
    INSERT OR IGNORE INTO badges (code, name, description, icon, category, req_type, req_val)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  for (const b of badges) {
    insertBadge.run(b.code, b.name, b.description, b.icon, b.category, b.req_type, b.req_val);
  }

  // 2. Criação de Usuários Padrão (Aluno e Professor)
  const salt = bcrypt.genSaltSync(10);
  const studentPasswordHash = bcrypt.hashSync('senha123', salt);
  const teacherPasswordHash = bcrypt.hashSync('senha123', salt);

  const insertUser = db.prepare(`
    INSERT OR IGNORE INTO users (name, email, password_hash, role, avatar, grade, bio, xp, level, coins)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  // Aluno Demonstrativo
  insertUser.run(
    'Lucas Silva',
    'aluno@mathplay.com',
    studentPasswordHash,
    'aluno',
    'robot',
    '7º Ano B',
    'Adoro jogos de raciocínio lógico e desafios com números!',
    320,
    3,
    180
  );

  // Professor Demonstrativo
  insertUser.run(
    'Prof. Carlos Oliveira',
    'professor@mathplay.com',
    teacherPasswordHash,
    'professor',
    'wizard',
    'Ensino Fundamental II',
    'Professor de Matemática há 10 anos, focado em metodologias ativas.',
    1200,
    10,
    999
  );

  // Aluno 2 para Ranking
  insertUser.run(
    'Mariana Costa',
    'mariana@mathplay.com',
    studentPasswordHash,
    'aluno',
    'owl',
    '8º Ano A',
    'Focada em dominar álgebra e frações!',
    580,
    4,
    320
  );

  // Aluno 3 para Ranking
  insertUser.run(
    'Pedro Henrique',
    'pedro@mathplay.com',
    studentPasswordHash,
    'aluno',
    'astronaut',
    '7º Ano A',
    'Explorando o universo da matemática!',
    180,
    2,
    95
  );

  // 3. Inicialização de trilha para o Lucas (Aluno)
  const lucasUser = db.prepare("SELECT id FROM users WHERE email = 'aluno@mathplay.com'").get();
  if (lucasUser) {
    const userId = lucasUser.id;

    // Conceder a insígnia de 'Primeiro Passo'
    const firstStepBadge = db.prepare("SELECT id FROM badges WHERE code = 'first_step'").get();
    if (firstStepBadge) {
      db.prepare(`
        INSERT OR IGNORE INTO user_badges (user_id, badge_id)
        VALUES (?, ?)
      `).run(userId, firstStepBadge.id);
    }

    // Inicializar trilha de aprendizagem (fases 1 a 6)
    const stages = [
      { stage: 1, stars: 3, status: 'completed', best_score: 500 },
      { stage: 2, stars: 2, status: 'completed', best_score: 420 },
      { stage: 3, stars: 0, status: 'unlocked', best_score: 0 },
      { stage: 4, stars: 0, status: 'locked', best_score: 0 },
      { stage: 5, stars: 0, status: 'locked', best_score: 0 },
      { stage: 6, stars: 0, status: 'locked', best_score: 0 }
    ];

    const insertTrack = db.prepare(`
      INSERT OR REPLACE INTO learning_track (user_id, stage_id, stars, status, best_score)
      VALUES (?, ?, ?, ?, ?)
    `);

    for (const s of stages) {
      insertTrack.run(userId, s.stage, s.stars, s.status, s.best_score);
    }

    // Algumas partidas iniciais no histórico
    const insertSession = db.prepare(`
      INSERT INTO game_sessions (user_id, game_type, score, correct_answers, wrong_answers, accuracy, difficulty, xp_earned, duration_seconds)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertSession.run(userId, 'equacoes', 500, 5, 0, 1.0, 'facil', 150, 42);
    insertSession.run(userId, 'fracoes', 420, 4, 1, 0.8, 'facil', 120, 55);
  }

  console.log('✅ Seeds concluídas com sucesso!');
}

if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
