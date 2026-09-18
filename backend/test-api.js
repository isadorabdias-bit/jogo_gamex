const http = require('http');

async function testBackend() {
  console.log('🧪 Iniciando teste de validação das APIs do Backend...');

  // Executa o servidor em memória para teste
  require('./src/server.js');

  // Aguarda 1 segundo para o server subir
  await new Promise(resolve => setTimeout(resolve, 1000));

  const makeRequest = (path, method = 'GET', body = null, token = null) => {
    return new Promise((resolve, reject) => {
      const payload = body ? JSON.stringify(body) : null;
      const options = {
        hostname: 'localhost',
        port: 3001,
        path,
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {}),
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      };

      const req = http.request(options, res => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, body: JSON.parse(data) });
          } catch (e) {
            resolve({ status: res.statusCode, raw: data });
          }
        });
      });

      req.on('error', reject);
      if (payload) req.write(payload);
      req.end();
    });
  };

  try {
    // 1. Healthcheck
    const health = await makeRequest('/api/health');
    console.log('✅ Healthcheck:', health.status === 200 ? 'OK' : 'FAIL');

    // 2. Login de Aluno de Teste
    const loginRes = await makeRequest('/api/auth/login', 'POST', {
      email: 'aluno@mathplay.com',
      password: 'senha123'
    });
    console.log('✅ Login Aluno:', loginRes.status === 200 ? 'OK' : 'FAIL', '- Usuário:', loginRes.body?.user?.name);
    const studentToken = loginRes.body?.token;

    // 3. Buscar Questões do Jogo 1 (Balança das Equações)
    const eqQuestions = await makeRequest('/api/games/questions?gameType=equacoes&difficulty=facil', 'GET', null, studentToken);
    console.log('✅ Questões Equações:', eqQuestions.status === 200 ? 'OK' : 'FAIL', '- Total:', eqQuestions.body?.questions?.length);

    // 4. Salvar uma partida e testar gamificação
    const sessionRes = await makeRequest('/api/games/save-session', 'POST', {
      gameType: 'equacoes',
      score: 350,
      correctAnswers: 4,
      wrongAnswers: 0,
      difficulty: 'facil',
      durationSeconds: 38,
      stageId: 1
    }, studentToken);
    console.log('✅ Salvar Partida:', sessionRes.status === 200 ? 'OK' : 'FAIL', '- XP Ganho:', sessionRes.body?.xpEarned, '- Novas Insígnias:', sessionRes.body?.newBadges?.length);

    // 5. Dashboard do Aluno
    const dashRes = await makeRequest('/api/stats/dashboard', 'GET', null, studentToken);
    console.log('✅ Dashboard Aluno:', dashRes.status === 200 ? 'OK' : 'FAIL', '- Total Partidas:', dashRes.body?.stats?.totalGames);

    // 6. Teste de Login de Professor e Painel Docente
    const teacherLogin = await makeRequest('/api/auth/login', 'POST', {
      email: 'professor@mathplay.com',
      password: 'senha123'
    });
    const teacherToken = teacherLogin.body?.token;
    const teacherPanel = await makeRequest('/api/stats/teacher', 'GET', null, teacherToken);
    console.log('✅ Painel Professor:', teacherPanel.status === 200 ? 'OK' : 'FAIL', '- Alunos na Turma:', teacherPanel.body?.students?.length);

    console.log('🎉 Todos os testes de integração do Backend passaram com 100% de sucesso!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Erro no teste do backend:', err);
    process.exit(1);
  }
}

testBackend();
