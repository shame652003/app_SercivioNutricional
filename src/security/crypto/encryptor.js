// encryptor.js
import JSEncrypt from 'jsencrypt';
import { PUBLIC_KEY } from '../keys/rsaPublicKey';

export const encryptData = (data) => {
  const jsEncrypt = new JSEncrypt();
  jsEncrypt.setPublicKey(PUBLIC_KEY);
  const plainText = JSON.stringify(data);
  const encrypted = jsEncrypt.encrypt(plainText);
  if (!encrypted) throw new Error('Error al cifrar los datos');
  return encrypted; // base64 string
};
