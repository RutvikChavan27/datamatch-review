import { CognitoUserPool } from 'amazon-cognito-identity-js';
import CryptoJS from 'crypto-js';

const poolData = {
  UserPoolId: 'us-east-1_HpW10zP5i',
  ClientId: '74l6el752u2hcu63a8nv75lr4g',
};

export const userPool = new CognitoUserPool(poolData);

export const calculateSecretHash = (username: string) => {
  const message = username + poolData.ClientId;
  const hmac = CryptoJS.HmacSHA256(message, poolData.ClientSecret as string);
  return hmac.toString(CryptoJS.enc.Base64);
};
