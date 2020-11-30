export const environment = {
  production: true,
  appVersion: require('../../package.json').version,
  firebase: {
    apiKey: '[API_KEY]',
    authDomain: '[DOMAIN]',
    databaseURL: '[DATABASE_URL]',
    projectId: '[PROJECT_ID]',
    storageBucket: '[STORAGE_BUCKET]',
    messagingSenderId: '[ID]',
  }
};
