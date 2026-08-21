import boxImage from '../assets/medications/caixa_generica_1.png';


export const COLORS = {
  primary: {
    main: '#9333ea', // purple-600
    light: '#c084fc', // purple-400
    dark: '#7e22ce', // purple-700
  },
  success: {
    main: '#22c55e', // green-500
    light: '#86efac', // green-300
    dark: '#16a34a', // green-600
  },
  danger: {
    main: '#ef4444', // red-500
    light: '#fca5a5', // red-300
    dark: '#dc2626', // red-600
  },
  warning: {
    main: '#f59e0b', // amber-500
  },
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    500: '#6b7280',
    600: '#4b5563',
    800: '#1f2937',
  },
} as const;

// TIPOS DE MEDICAMENTO
export const MEDICATION_TYPES = {
  TABLET: 'tablet',
  CAPSULE: 'capsule',
  LIQUID: 'liquid',
  INJECTION: 'injection',
} as const;

export const MEDICATION_TYPE_LABELS: Record<string, string> = {
  [MEDICATION_TYPES.TABLET]: 'Comprimido',
  [MEDICATION_TYPES.CAPSULE]: 'Cápsula',
  [MEDICATION_TYPES.LIQUID]: 'Líquido',
  [MEDICATION_TYPES.INJECTION]: 'Injeção',
};

// Cor de cada forma farmacêutica, usada nos medalhões da busca
export const MEDICATION_TYPE_COLORS: Record<string, string> = {
  'Comprimido': '#9254AD',
  'Cápsula': '#5B2A78',
  'Líquido': '#06b6d4',
  'Injeção': '#ef4444',
  'Ampola': '#ef4444',
};

// Rótulos curtos para o card — linguagem simples, sem jargão de bula
export const MEAL_LABELS: Record<string, string> = {
  'Antes da Refeição': 'Antes de comer',
  'Após Refeição': 'Depois de comer',
  'Com Refeição': 'Com comida',
  'Independente': 'Livre',
};

// ============================================
// STATUS DE MEDICAMENTO
// ============================================
export const MEDICATION_STATUS = {
  PENDING: 'pending',
  TAKEN: 'taken',
  SKIPPED: 'skipped',
} as const;

export const MEDICATION_STATUS_LABELS: Record<string, string> = {
  [MEDICATION_STATUS.PENDING]: 'Pendente',
  [MEDICATION_STATUS.TAKEN]: 'Tomado',
  [MEDICATION_STATUS.SKIPPED]: 'Esquecido',
};


// ============================================
// STORAGE KEYS
// ============================================
// ============================================
// BRAND COLORS
// ============================================
export const BRAND_COLORS: Record<string, string> = {
  ACHE: '#ef4444', // red-500
  HYOSCINE: '#8b5cf6', // violet-500
  NOVALGINA: '#64748b', // slate-500
  MEDLEY: '#06b6d4', // cyan-500
  TYLENOL: '#ec4899', // pink-500
  EMS: '#0ea5e9', // sky-500
  AMOXIL: '#6366f1', // indigo-500
  EUROFARMA: '#10b981', // emerald-500
  ARADOIS: '#f59e0b', // amber-500
  'NEO QUÍMICA': '#8b5cf6', // violet-500
  LOSEC: '#7c3aed', // violet-600
  'PRATI-DONADUZZI': '#06b6d4', // cyan-500
  LUFTAL: '#41833b', // yellow-500
  CIMED: '#fbbf24', // amber-400
  'NOVO NORDISK': '#1e40af', // blue-700
  'ELI LILLY': '#b91c1c', // red-700
  CEBION: '#f97316', // orange-500
  REDOXON: '#f87171', // red-400
  KENVUE: '#1f2937', // gray-800
  HALEON: '#06b6d4', // cyan-500
  SANOFI: '#ffffff', // white
  GENÉRICO: '#9ca3af', // gray-400
} as const;

// ============================================
// STORAGE KEYS
// ============================================
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER: 'user',
  MEDICATIONS: 'my_medications',
  PREFERENCES: 'user_preferences',
  ACCESSIBILITY: 'accessibility_settings',
} as const;



// export const MESSAGES = {
//   SUCCESS: {
//     MEDICATION_SAVED: 'Medicamento salvo com sucesso!',
//     MEDICATION_UPDATED: 'Medicamento atualizado com sucesso!',
//     MEDICATION_DELETED: 'Medicamento excluído com sucesso!',
//     MEDICATION_TAKEN: 'Medicamento marcado como tomado!',
//   },
//   ERROR: {
//     REQUIRED_FIELDS: 'Por favor, preencha todos os campos obrigatórios.',
//     GENERIC: 'Algo deu errado. Tente novamente.',
//     NO_MEDICATIONS: 'Nenhum medicamento para este dia.',
//   },
//   CONFIRM: {
//     DELETE_MEDICATION: 'Tem certeza que deseja excluir este medicamento?',
//     LOGOUT: 'Deseja realmente sair?',
//   },
// } as const;


// export const BRAND_COLORS = {
//   CIMED: '#FFC600', // Amarelo principal (logo vibrante)
//   MEDLEY: '#40E0D0', // Turquesa principal (azul-esverdeado)
//   ACHE: '#015A80', // Azul escuro
//   EMS: '#003366', // Azul marinho
//   EUROFARMA: '#CC1715', // Vermelho
//   NEO_QUIMICA: '#242B6B', // Azul escuro
// } as const;


export const BOX_IMAGE = boxImage;