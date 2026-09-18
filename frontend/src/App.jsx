import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AccessibilityProvider } from './context/AccessibilityContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AccessibilityBar from './components/AccessibilityBar';
import HomeHub from './pages/HomeHub';
import Dashboard from './pages/Dashboard';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import TeacherPanel from './pages/TeacherPanel';
import Login from './pages/Login';
import Register from './pages/Register';
import EquationGame from './games/EquationGame';
import FractionGame from './games/FractionGame';

function MainApp() {
  const { user, loading, isAuthenticated, isTeacher } = useAuth();
  const [currentView, setCurrentView] = useState('hub');
  const [activeGameConfig, setActiveGameConfig] = useState(null);

  if (loading) {
    return (
      <div
        className="min-h-screen bg-slate-900 flex flex-col items-center justify-center"
        role="status"
        aria-label="Carregando a plataforma MathPlay Solutions"
      >
        <div className="w-14 h-14 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mb-4" aria-hidden="true" />
        <h2 className="text-xl font-black text-white">MathPlay Solutions</h2>
        <p className="text-xs text-slate-400 mt-1">Carregando ambiente gamificado...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (currentView === 'register') {
      return (
        <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
          {/* Skip link para acessibilidade por teclado */}
          <a href="#main-content" className="skip-to-main">
            Pular para o conteúdo principal
          </a>
          <main id="main-content">
            <Register
              onGoToLogin={() => setCurrentView('login')}
              onRegisterSuccess={() => setCurrentView('hub')}
            />
          </main>
          <Footer />
          <AccessibilityBar />
        </div>
      );
    }
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
        <a href="#main-content" className="skip-to-main">
          Pular para o conteúdo principal
        </a>
        <main id="main-content">
          <Login
            onGoToRegister={() => setCurrentView('register')}
            onLoginSuccess={() => setCurrentView('hub')}
          />
        </main>
        <Footer />
        <AccessibilityBar />
      </div>
    );
  }

  const handleStartGame = ({ gameType, difficulty, stageId = null }) => {
    setActiveGameConfig({ stageId, difficulty });
    setCurrentView(gameType === 'equacoes' ? 'game-equacoes' : 'game-fracoes');
  };

  const handleBackToHub = () => {
    setActiveGameConfig(null);
    setCurrentView('hub');
  };

  // Mapeia view atual para label legível por leitores de tela
  const viewLabels = {
    hub: 'Trilha de Aprendizagem',
    'game-equacoes': 'Jogo: Balança das Equações',
    'game-fracoes': 'Jogo: Mestre das Frações e Porcentagens',
    dashboard: 'Meu Progresso',
    leaderboard: 'Ranking de Alunos',
    profile: 'Editar Perfil',
    teacher: 'Painel do Professor'
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* Skip link para acessibilidade por teclado */}
      <a href="#main-content" className="skip-to-main">
        Pular para o conteúdo principal
      </a>

      <Navbar currentView={currentView} setCurrentView={setCurrentView} />

      {/* Anuncio para leitores de tela ao mudar de página */}
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {viewLabels[currentView] || 'Nova seção carregada'}
      </div>

      <main
        id="main-content"
        className="flex-1"
        aria-label={viewLabels[currentView] || 'Conteúdo principal'}
        tabIndex={-1}
      >
        {currentView === 'hub' && (
          <HomeHub onStartGame={handleStartGame} />
        )}

        {currentView === 'game-equacoes' && (
          <EquationGame
            stageId={activeGameConfig?.stageId}
            initialDifficulty={activeGameConfig?.difficulty || 'facil'}
            onBackToHub={handleBackToHub}
          />
        )}

        {currentView === 'game-fracoes' && (
          <FractionGame
            stageId={activeGameConfig?.stageId}
            initialDifficulty={activeGameConfig?.difficulty || 'facil'}
            onBackToHub={handleBackToHub}
          />
        )}

        {currentView === 'dashboard' && <Dashboard />}
        {currentView === 'leaderboard' && <Leaderboard />}
        {currentView === 'profile' && <Profile />}

        {currentView === 'teacher' && (
          isTeacher ? <TeacherPanel /> : <HomeHub onStartGame={handleStartGame} />
        )}
      </main>

      <Footer />

      {/* Barra de Acessibilidade flutuante — acessível por teclado e leitores de tela */}
      <AccessibilityBar />
    </div>
  );
}

export default function App() {
  return (
    <AccessibilityProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </AccessibilityProvider>
  );
}
