import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import AvatarIcon, { AVATAR_OPTIONS } from '../components/AvatarIcon';
import { sound } from '../utils/audio';
import { User, Check, Sparkles, Coins, Award } from 'lucide-react';

export default function Profile() {
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(user?.avatar || 'robot');
  const [grade, setGrade] = useState(user?.grade || '7º Ano');
  const [bio, setBio] = useState(user?.bio || '');
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSave = async (e) => {
    e.preventDefault();
    sound.playClick();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      await updateProfile({
        name,
        avatar,
        grade,
        bio
      });
      sound.playCorrect();
      setSuccessMsg('Perfil atualizado com sucesso no banco de dados!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg(err.message || 'Erro ao salvar alterações.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      
      <div className="text-center space-y-2">
        <div className="inline-flex p-3 rounded-2xl bg-brand-500/20 text-brand-400 border border-brand-500/30 mb-2">
          <User className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-black text-white">Editar Perfil do Gamer</h1>
        <p className="text-slate-400 text-sm">
          Personalize seu avatar, apelido e informações da sua conta no MathPlay.
        </p>
      </div>

      <form onSubmit={handleSave} className="card-gaming space-y-6">
        
        {/* Escolha de Avatar */}
        <div>
          <label className="block text-xs font-black uppercase tracking-wider text-slate-300 mb-3">
            Escolha seu Avatar:
          </label>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
            {AVATAR_OPTIONS.map((opt) => {
              const isSelected = avatar === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setAvatar(opt.id);
                  }}
                  className={`p-1.5 rounded-2xl border-2 transition-all flex flex-col items-center gap-1 ${
                    isSelected
                      ? 'border-amber-400 bg-amber-400/10 scale-105 shadow-md shadow-amber-400/20'
                      : 'border-slate-700 bg-slate-800/60 hover:border-slate-600'
                  }`}
                  title={opt.name}
                >
                  <AvatarIcon avatarId={opt.id} size="md" />
                  <span className="text-[9px] font-bold text-slate-300 truncate max-w-[50px]">
                    {opt.name.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Nome / Apelido */}
        <div>
          <label className="block text-xs font-black uppercase tracking-wider text-slate-300 mb-2">
            Nome de Exibição
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-2xl text-white text-sm focus:outline-none focus:border-brand-500 transition"
          />
        </div>

        {/* Série Escolar */}
        <div>
          <label className="block text-xs font-black uppercase tracking-wider text-slate-300 mb-2">
            Ano / Série Escolar (Ensino Fundamental II)
          </label>
          <select
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-2xl text-white text-sm focus:outline-none focus:border-brand-500 transition"
          >
            <option value="6º Ano">6º Ano do Ensino Fundamental</option>
            <option value="7º Ano">7º Ano do Ensino Fundamental</option>
            <option value="8º Ano">8º Ano do Ensino Fundamental</option>
            <option value="9º Ano">9º Ano do Ensino Fundamental</option>
            <option value="Docente / Professor">Docente / Professor</option>
          </select>
        </div>

        {/* Mini Biografia */}
        <div>
          <label className="block text-xs font-black uppercase tracking-wider text-slate-300 mb-2">
            Biografia ou Meta de Aprendizado
          </label>
          <textarea
            rows="3"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Ex: Quero dominar equações e frações para gabaritar as olimpíadas!"
            className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-2xl text-white text-sm focus:outline-none focus:border-brand-500 transition"
          />
        </div>

        {/* Mensagens de Sucesso ou Erro */}
        {successMsg && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold text-center">
            {successMsg}
          </div>
        )}

        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold text-center">
            {errorMsg}
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="w-full btn-game-primary flex items-center justify-center gap-2 text-sm"
        >
          {saving ? (
            <span>Salvando no banco...</span>
          ) : (
            <>
              <Check className="w-4 h-4" />
              <span>Salvar Alterações</span>
            </>
          )}
        </button>

      </form>
    </div>
  );
}
