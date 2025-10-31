import { CognitoUserPool } from 'amazon-cognito-identity-js';
import CryptoJS from 'crypto-js';

const poolData = {
  UserPoolId: '',  // Removed for static login
  ClientId: '',    // Removed for static login
};

export const userPool = new CognitoUserPool(poolData);

export const calculateSecretHash = (username: string) => {
  const message = username + poolData.ClientId;
  const hmac = CryptoJS.HmacSHA256(message, poolData.ClientSecret as string);
  return hmac.toString(CryptoJS.enc.Base64);
};
