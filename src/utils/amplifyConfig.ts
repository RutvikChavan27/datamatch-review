import { Amplify } from 'aws-amplify';

Amplify.configure({
  Auth: {
    Cognito: {
      region: '',          // Removed for static login
      userPoolId: '',      // Removed for static login
      userPoolClientId: '' // Removed for static login
    }
  }
});
