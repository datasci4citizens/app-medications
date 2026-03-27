// src/utils/storage.ts

export const storage = {
  // Salvar qualquer coisa
  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Erro ao salvar:', error);
    }
  },

  // Buscar qualquer coisa
  get: <T>(key: string): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Erro ao buscar:', error);
      return null;
    }
  },

  // Remover
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Erro ao remover:', error);
    }
  },

  // Limpar tudo
  clear: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Erro ao limpar:', error);
    }
  },
};




