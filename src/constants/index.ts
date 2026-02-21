
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
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER: 'user',
  MEDICATIONS: 'my_medications',
  PREFERENCES: 'user_preferences',
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

