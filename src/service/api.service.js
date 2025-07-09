import apis from "@/api";
import { decryptResponse, encryptRequest } from "@/cryptoUtils";
import reduxInstance from "@/redux/store";

// Utility to get token from Redux store
const getToken = () => {
  const state = reduxInstance.store.getState();
  return state.auth?.token;
};

const headers = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getToken()}`
});

// API service methods
export const sendPasswordOtp = async (email) => {
  const response = await fetch(apis.sendPasswordOtp, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(encryptRequest({ email }))
  });
  const decrypted = decryptResponse(await response.json());
  return decrypted;
};

export const confirmNewPassword = async (email, otp, newPassword) => {
  const response = await fetch(apis.confirmNewPassword, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(encryptRequest({ email, otp, newPassword }))
  });
  const decrypted = decryptResponse(await response.json());
  return decrypted;
};
