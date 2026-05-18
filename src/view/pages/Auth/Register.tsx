import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../viewmodel/contexts/AuthContext';
import { ProgressBar } from '../../components/common/ProgressBar';

interface RegisterData {
  name: string;
  age: string;
  conditions: string[];
  wakeTime: string;
  sleepTime: string;
  emergencyName: string;
  emergencyPhone: string;
  photo: string;
}

const TOTAL_STEPS = 7;

export function Register() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<RegisterData>({
    name: '', age: '', conditions: [],
    wakeTime: '07:00', sleepTime: '22:00',
    emergencyName: '', emergencyPhone: '',
    photo: '',
  });
  const navigate = useNavigate();
  const { login } = useAuth();

  const update = (patch: Partial<RegisterData>) =>
    setData(d => ({ ...d, ...patch }));

  const goNext = () => setStep(s => Math.min(TOTAL_STEPS - 1, s + 1));
  const goBack = () => {
    if (step === 0) navigate('/');
    else setStep(s => s - 1);
  };

  const handleDone = () => {
    login(
      { id: 'local-' + Date.now(), name: data.name || 'Usuário', email: '' },
      'local-token',
    );
    navigate('/home');
  };

  const steps = [
    <StepWelcome onNext={goNext} />,
    <StepName data={data} update={update} onNext={goNext} />,
    <StepHealth data={data} update={update} onNext={goNext} />,
    <StepRoutine data={data} update={update} onNext={goNext} />,
    <StepEmergency data={data} update={update} onNext={goNext} />,
    <StepPhoto data={data} update={update} onNext={goNext} />,
    <StepDone data={data} onDone={handleDone} />,
  ];

  return (
    <div className="min-h-screen bg-[#f6f2fb] relative overflow-hidden flex flex-col">

      {/* Gradiente decorativo */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 260,
        background: 'radial-gradient(120% 80% at 50% 0%, rgba(91,42,120,0.35), transparent 70%)',
        pointerEvents: 'none',
      }}/>

      {/* Topo: voltar + label + progresso */}
      <div className="relative z-10 pt-14 px-5">
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={goBack}
            className="w-11 h-11 rounded-full bg-white/70 flex items-center justify-center shadow-sm"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M15 6l-6 6 6 6" stroke="var(--color-darkpurple)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div>
            <p className="font-inter text-[11px] font-bold tracking-widest uppercase text-gray-400">
              Passo {step + 1} de {TOTAL_STEPS}
            </p>
            <p className="font-merriweather font-extrabold text-xl text-inkblack">
              Criar conta
            </p>
          </div>
        </div>
        <ProgressBar current={step} total={TOTAL_STEPS} />
      </div>

      {/* Conteúdo do step */}
      <div key={step} className="relative z-10 flex-1 flex flex-col px-6 pt-6 animate-fade-slide-up">
        {steps[step]}
      </div>

    </div>
  );
}

// ─── Steps ────────────────────────────────────────────────────

function StepWelcome({ onNext }: { onNext: () => void }) {
  const items = [
    { icon: '⏰', title: 'Lembretes na hora certa', desc: 'Sem mais doses esquecidas.' },
    { icon: '💊', title: 'Seu tratamento organizado', desc: 'Tudo num só lugar.' },
    { icon: '🧓', title: 'Pensado para você', desc: 'Letras grandes, fácil de usar.' },
  ];
  return (
    <div className="flex flex-col flex-1">
      <h2 className="font-merriweather font-black text-[28px] text-inkblack tracking-tight leading-tight mb-2">
        Vamos te conhecer
      </h2>
      <p className="font-inter text-sm text-gray-500 mb-6 leading-relaxed">
        Algumas perguntas rápidas para que o LembraMed cuide bem de você.
      </p>

      <div className="flex flex-col gap-3">
        {items.map((x, i) => (
          <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-[18px] shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-darkpurple/10 flex items-center justify-center text-2xl flex-shrink-0">
              {x.icon}
            </div>
            <div>
              <p className="font-merriweather font-bold text-[15px] text-inkblack">{x.title}</p>
              <p className="font-inter text-xs text-gray-500 mt-0.5">{x.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onNext}
        className="mt-auto mb-2 h-16 w-full rounded-full bg-darkpurple text-white font-merriweather font-black text-xl btn-shine shadow-[0_12px_28px_rgba(91,42,120,0.35)] transition-transform active:scale-[0.97]"
      >
        Começar →
      </button>
    </div>
  );
}

function StepName({ data, update, onNext }: { data: RegisterData; update: (p: Partial<RegisterData>) => void; onNext: () => void }) {
  return (
    <div className="flex flex-col flex-1">
      <h2 className="font-merriweather font-black text-[26px] text-inkblack tracking-tight leading-tight mb-1">
        Como devemos te chamar?
      </h2>
      <p className="font-inter text-sm text-gray-500 mb-6">Vai aparecer no topo da tela inicial.</p>

      <input
        autoFocus
        type="text"
        placeholder="Seu nome"
        value={data.name}
        onChange={e => update({ name: e.target.value })}
        className="w-full px-5 py-4 rounded-[18px] font-merriweather font-bold text-xl text-inkblack bg-white border-2 outline-none transition-colors"
        style={{ borderColor: data.name ? 'var(--color-darkpurple)' : 'transparent' }}
      />

      <div className="mt-5">
        <p className="font-inter text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Idade (opcional)</p>
        <input
          type="number"
          placeholder="Ex: 68"
          value={data.age}
          onChange={e => update({ age: e.target.value })}
          className="w-full px-5 py-4 rounded-[18px] font-merriweather font-bold text-xl text-inkblack bg-white border-2 outline-none transition-colors"
          style={{ borderColor: data.age ? 'var(--color-darkpurple)' : 'transparent' }}
        />
      </div>

      <button
        onClick={onNext}
        disabled={data.name.trim().length < 2}
        className="mt-auto mb-2 h-16 w-full rounded-full bg-darkpurple text-white font-merriweather font-black text-xl btn-shine shadow-[0_12px_28px_rgba(91,42,120,0.35)] transition-transform active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Próximo →
      </button>
    </div>
  );
}

const CONDITIONS = [
  { id: 'hypertension', label: 'Pressão alta', emoji: '🩺' },
  { id: 'diabetes',     label: 'Diabetes',     emoji: '💉' },
  { id: 'cholesterol',  label: 'Colesterol',   emoji: '🥗' },
  { id: 'cardiac',      label: 'Coração',      emoji: '❤️' },
  { id: 'thyroid',      label: 'Tireoide',     emoji: '🦋' },
  { id: 'other',        label: 'Outra',        emoji: '＋' },
];

function StepHealth({ data, update, onNext }: { data: RegisterData; update: (p: Partial<RegisterData>) => void; onNext: () => void }) {
  const toggle = (id: string) => {
    const conditions = data.conditions.includes(id)
      ? data.conditions.filter(c => c !== id)
      : [...data.conditions, id];
    update({ conditions });
  };

  return (
    <div className="flex flex-col flex-1">
      <h2 className="font-merriweather font-black text-[26px] text-inkblack tracking-tight leading-tight mb-1">
        Você tem alguma condição?
      </h2>
      <p className="font-inter text-sm text-gray-500 mb-5">Para sugerir lembretes mais úteis. Pule se preferir.</p>

      <div className="flex flex-col gap-2.5">
        {CONDITIONS.map(c => {
          const active = data.conditions.includes(c.id);
          return (
            <button
              key={c.id}
              onClick={() => toggle(c.id)}
              className="flex items-center gap-4 px-4 py-3.5 rounded-[16px] text-left transition-all border-2"
              style={{
                background: active ? 'rgba(91,42,120,0.08)' : '#fff',
                borderColor: active ? 'var(--color-darkpurple)' : 'transparent',
              }}
            >
              <span className="text-xl">{c.emoji}</span>
              <span className="flex-1 font-merriweather font-bold text-[16px] text-inkblack">{c.label}</span>
              <span className="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all"
                style={{
                  background: active ? 'var(--color-darkpurple)' : 'transparent',
                  borderColor: active ? 'var(--color-darkpurple)' : '#ccc',
                }}>
                {active && <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M5 12.5L10 17.5L19 7" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex gap-3 mt-auto mb-2">
        <button onClick={onNext} className="flex-none px-6 h-16 rounded-full border-2 border-darkpurple/20 font-merriweather font-bold text-darkpurple transition-transform active:scale-[0.97]">
          Pular
        </button>
        <button onClick={onNext} className="flex-1 h-16 rounded-full bg-darkpurple text-white font-merriweather font-black text-xl btn-shine shadow-[0_12px_28px_rgba(91,42,120,0.35)] transition-transform active:scale-[0.97]">
          Próximo →
        </button>
      </div>
    </div>
  );
}

function StepRoutine({ data, update, onNext }: { data: RegisterData; update: (p: Partial<RegisterData>) => void; onNext: () => void }) {
  return (
    <div className="flex flex-col flex-1">
      <h2 className="font-merriweather font-black text-[26px] text-inkblack tracking-tight leading-tight mb-1">
        Como é sua rotina?
      </h2>
      <p className="font-inter text-sm text-gray-500 mb-5">Vamos sugerir os melhores horários para seus medicamentos.</p>

      <div className="flex flex-col gap-3">
        {[
          { label: 'Acorda às', icon: '☀️', field: 'wakeTime' as const },
          { label: 'Dorme às',  icon: '🌙', field: 'sleepTime' as const },
        ].map(row => (
          <div key={row.field} className="flex items-center gap-4 px-4 py-3.5 bg-white rounded-[18px] shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-yellow-400/20 flex items-center justify-center text-2xl flex-shrink-0">
              {row.icon}
            </div>
            <span className="flex-1 font-merriweather font-bold text-[16px] text-inkblack">{row.label}</span>
            <input
              type="time"
              value={data[row.field]}
              onChange={e => update({ [row.field]: e.target.value })}
              className="font-merriweather font-extrabold text-xl text-darkpurple bg-transparent border-none outline-none w-24 text-right"
            />
          </div>
        ))}
      </div>

      <button
        onClick={onNext}
        className="mt-auto mb-2 h-16 w-full rounded-full bg-darkpurple text-white font-merriweather font-black text-xl btn-shine shadow-[0_12px_28px_rgba(91,42,120,0.35)] transition-transform active:scale-[0.97]"
      >
        Próximo →
      </button>
    </div>
  );
}

function StepEmergency({ data, update, onNext }: { data: RegisterData; update: (p: Partial<RegisterData>) => void; onNext: () => void }) {
  return (
    <div className="flex flex-col flex-1">
      <h2 className="font-merriweather font-black text-[26px] text-inkblack tracking-tight leading-tight mb-1">
        Contato de emergência
      </h2>
      <p className="font-inter text-sm text-gray-500 mb-5">Caso uma dose seja esquecida, podemos avisar alguém. Opcional.</p>

      <div className="flex flex-col gap-4">
        <div>
          <p className="font-inter text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Nome</p>
          <input
            type="text"
            placeholder="Ex: Filha Maria"
            value={data.emergencyName}
            onChange={e => update({ emergencyName: e.target.value })}
            className="w-full px-5 py-4 rounded-[18px] font-merriweather font-bold text-xl text-inkblack bg-white border-2 outline-none transition-colors"
            style={{ borderColor: data.emergencyName ? 'var(--color-darkpurple)' : 'transparent' }}
          />
        </div>
        <div>
          <p className="font-inter text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Telefone</p>
          <input
            type="tel"
            placeholder="(11) 9 9999-9999"
            value={data.emergencyPhone}
            onChange={e => update({ emergencyPhone: e.target.value })}
            className="w-full px-5 py-4 rounded-[18px] font-merriweather font-bold text-xl text-inkblack bg-white border-2 outline-none transition-colors"
            style={{ borderColor: data.emergencyPhone ? 'var(--color-darkpurple)' : 'transparent' }}
          />
        </div>

        <div className="flex gap-3 items-start p-4 rounded-2xl bg-yellow-400/15">
          <span className="text-lg">🔒</span>
          <p className="font-inter text-xs text-yellow-900/80 leading-relaxed">
            Lorem ipsum
          </p>
        </div>
      </div>

      <div className="flex gap-3 mt-auto mb-2">
        <button onClick={onNext} className="flex-none px-6 h-16 rounded-full border-2 border-darkpurple/20 font-merriweather font-bold text-darkpurple transition-transform active:scale-[0.97]">
          Pular
        </button>
        <button onClick={onNext} className="flex-1 h-16 rounded-full bg-darkpurple text-white font-merriweather font-black text-xl btn-shine shadow-[0_12px_28px_rgba(91,42,120,0.35)] transition-transform active:scale-[0.97]">
          Próximo →
        </button>
      </div>
    </div>
  );
}

function StepPhoto({ data, update, onNext }: { data: RegisterData; update: (p: Partial<RegisterData>) => void; onNext: () => void }) {
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => update({ photo: reader.result as string });
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col flex-1">
      <h2 className="font-merriweather font-black text-[26px] text-inkblack tracking-tight leading-tight mb-1">
        Foto de perfil
      </h2>
      <p className="font-inter text-sm text-gray-500 mb-8">Opcional — você pode adicionar depois.</p>

      <div className="flex flex-col items-center gap-5">
        {/* Preview / placeholder */}
        <div className="relative w-36 h-36">
          {data.photo ? (
            <img
              src={data.photo}
              alt="Foto de perfil"
              className="w-36 h-36 rounded-full object-cover shadow-lg border-4 border-white"
            />
          ) : (
            <div className="w-36 h-36 rounded-full bg-white shadow-md border-4 border-white flex items-center justify-center">
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="4" stroke="var(--color-darkpurple)" strokeWidth="1.8" opacity="0.4"/>
                <path d="M4 21c0-4 4-6 8-6s8 2 8 6" stroke="var(--color-darkpurple)" strokeWidth="1.8" strokeLinecap="round" opacity="0.4"/>
              </svg>
            </div>
          )}

          {/* Botão câmera sobreposto */}
          <label className="absolute bottom-0 right-0 w-11 h-11 rounded-full bg-darkpurple flex items-center justify-center shadow-lg cursor-pointer transition-transform active:scale-95">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" stroke="#fff" strokeWidth="2" strokeLinejoin="round"/>
              <circle cx="12" cy="13" r="4" stroke="#fff" strokeWidth="2"/>
            </svg>
            <input type="file" accept="image/*" className="hidden" onChange={handleFile}/>
          </label>
        </div>

        {data.photo && (
          <button
            onClick={() => update({ photo: '' })}
            className="font-inter text-sm text-gray-400 underline underline-offset-2"
          >
            Remover foto
          </button>
        )}
      </div>

      <div className="flex gap-3 mt-auto mb-2">
        <button onClick={onNext} className="flex-none px-6 h-16 rounded-full border-2 border-darkpurple/20 font-merriweather font-bold text-darkpurple transition-transform active:scale-[0.97]">
          Pular
        </button>
        <button onClick={onNext} className="flex-1 h-16 rounded-full bg-darkpurple text-white font-merriweather font-black text-xl btn-shine shadow-[0_12px_28px_rgba(91,42,120,0.35)] transition-transform active:scale-[0.97]">
          Próximo →
        </button>
      </div>
    </div>
  );
}

function StepDone({ data, onDone }: { data: RegisterData; onDone: () => void }) {
  const conditionLabels: Record<string, string> = {
    hypertension: 'Pressão alta', diabetes: 'Diabetes', cholesterol: 'Colesterol',
    cardiac: 'Coração', thyroid: 'Tireoide', other: 'Outra',
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="w-20 h-20 rounded-full bg-green-take flex items-center justify-center mb-5 shadow-[0_14px_28px_rgba(36,189,118,0.35)]">
        <svg width="38" height="38" viewBox="0 0 24 24" fill="none">
          <path d="M5 12.5L10 17.5L19 7" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      <h2 className="font-merriweather font-black text-[28px] text-inkblack tracking-tight leading-tight mb-1">
        Tudo pronto{data.name ? `, ${data.name.split(' ')[0]}` : ''}!
      </h2>
      <p className="font-inter text-sm text-gray-500 mb-5 leading-relaxed">
        Aqui está o que você nos contou. Pode mudar a qualquer momento nas Configurações.
      </p>

      <div className="bg-white rounded-[22px] p-5 border border-darkpurple/10 flex flex-col gap-3">
        {[
          { label: 'Nome',    value: data.name || '—' },
          data.age           ? { label: 'Idade',   value: `${data.age} anos` } : null,
          data.conditions.length > 0 ? { label: 'Condições', value: data.conditions.map(c => conditionLabels[c]).join(', ') } : null,
          { label: 'Rotina', value: `${data.wakeTime} → ${data.sleepTime}` },
          data.emergencyName ? { label: 'Emergência', value: `${data.emergencyName} · ${data.emergencyPhone || '—'}` } : null,
        ].filter(Boolean).map((row, i) => (
          <div key={i} className="flex justify-between items-start gap-4">
            <span className="font-inter text-xs text-gray-400 flex-shrink-0">{row!.label}</span>
            <span className="font-merriweather font-bold text-sm text-inkblack text-right">{row!.value}</span>
          </div>
        ))}
      </div>

      <button
        onClick={onDone}
        className="mt-auto mb-2 h-16 w-full rounded-full bg-green-take text-white font-merriweather font-black text-xl btn-shine shadow-[0_12px_28px_rgba(36,189,118,0.40)] transition-transform active:scale-[0.97]"
      >
        Começar a usar
      </button>
    </div>
  );
}
