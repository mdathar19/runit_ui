import CryptoJS from 'crypto-js';

// Must be same 32-character secret key you used in backend
const ENCRYPTION_KEY = 'mX3bTe9fQp7WkLa8ZrCdV5yNh2sPgJo0'; 
const IV_LENGTH = 16; 

export function encryptRequest(payload) {
  const iv = CryptoJS.lib.WordArray.random(IV_LENGTH);

  const encrypted = CryptoJS.AES.encrypt(JSON.stringify(payload), CryptoJS.enc.Utf8.parse(ENCRYPTION_KEY), {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return {
    encrypted: true,
    data: iv.toString(CryptoJS.enc.Hex) + ':' + encrypted.ciphertext.toString(CryptoJS.enc.Hex),
  };
}

export function decryptResponse(responseData) {
  const { data } = responseData;

  const parts = data.split(':');
  const iv = CryptoJS.enc.Hex.parse(parts[0]);
  const encryptedText = CryptoJS.enc.Hex.parse(parts[1]);
  const encryptedBase64 = CryptoJS.enc.Base64.stringify(encryptedText);

  const decrypted = CryptoJS.AES.decrypt(encryptedBase64, CryptoJS.enc.Utf8.parse(ENCRYPTION_KEY), {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
}
