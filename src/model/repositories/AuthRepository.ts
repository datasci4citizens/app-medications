import { storage } from './storage';

// Autenticação
export const authStorage = {
   saveToken: (token: string) => storage.set('auth_token', token),
   getToken: () => storage.get<string>('auth_token'),
   removeToken: () => storage.remove('auth_token'),

   saveUser: (user: any) => storage.set('user', user),
   getUser: () => storage.get('user'),
   removeUser: () => storage.remove('user'),

   clearAuth: () => {
      authStorage.removeToken();
      authStorage.removeUser();
   },
};