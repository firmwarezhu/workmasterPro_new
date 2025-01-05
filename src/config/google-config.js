export const GOOGLE_CONFIG = {
  clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
  scopes: [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/drive.readonly'
  ],
  redirectUris: [
    'https://firmwarezhu.github.io/workmasterPro_new/',
    'http://localhost:5174/workmasterPro_new/'
  ]
};
