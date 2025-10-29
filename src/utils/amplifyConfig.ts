import { Amplify } from 'aws-amplify';

Amplify.configure({
  Auth: {
    Cognito: {
      region: 'us-east-1',
      userPoolId: 'us-east-1_HpW10zP5i',
      userPoolClientId: '74l6el752u2hcu63a8nv75lr4g'
    }
  }
});
