import { SocialLogin } from '@capgo/capacitor-social-login';

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

export async function InitLogin() {
  await SocialLogin.initialize({
    google: {
      webClientId: clientId,
      // iOSServerClientId: 'your-google-server-client-id',
      mode: 'online',
    }
  });
}


export async function googleLogin() {
  const response = await SocialLogin.login({
    provider: 'google',
    options: {
      forceRefreshToken: true 
    }
  })  

  return response
}