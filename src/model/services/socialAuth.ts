import { SocialLogin } from '@capgo/capacitor-social-login';
import { Capacitor } from '@capacitor/core';
import type { User } from '../../types';

interface BackendAuthResponse {
  user: User;
  token: string;
}

const clientId = Capacitor.isNativePlatform()
  ? import.meta.env.VITE_GOOGLE_CLIENT_ID
  : import.meta.env.VITE_GOOGLE_WEB_CLIENT_ID;

console.log(Capacitor.isNativePlatform())

export async function InitLogin() {
  await SocialLogin.initialize({
    google: {
      webClientId: clientId,
      // iOSServerClientId: 'your-google-server-client-id',
      mode: 'online',
    }
  });
}


async function fetchGoogleToken() {
  const response = await SocialLogin.login({
    provider: 'google',
    options: {
      forceRefreshToken: true
    }
  })

  return response
}



export async function authenticateWithGoogle() {
  try {
    const response = await fetchGoogleToken();
    const result = response.result;
    if (!('idToken' in result) || !result.idToken) {
      throw new Error('Token do Google não recebido');
    }
    return handleGoogleSuccess({ idToken: result.idToken });
  } catch (error) {
    console.error('❌ Erro no googleLogin:', JSON.stringify(error));
    throw error;
  }
}

const handleGoogleSuccess = async (credentialResponse: { idToken: string }) => {
  console.log(credentialResponse.idToken)
  try {
    const apiUrl = 'http://127.0.0.1:8000';
    const response = await fetch(`${apiUrl}/auth/google/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: credentialResponse.idToken,
      }),
    });

    const data: BackendAuthResponse = await response.json();

    if (response.ok) {
      return data;
    } else {
      console.error('❌ Erro do backend:', data);
      throw new Error((data as { error?: string }).error || 'Erro desconhecido no login');
    }
  } catch (error) {
    console.error('❌ Erro de rede:', error);
    throw error;
  }
};