import apis from "../api";
import { encryptRequest } from "../cryptoUtils";


export const postFeedbackService = async (payload = {}) => {
    try {
        const encryptedBody = encryptRequest(payload);

        const response = await fetch(apis.postFeedBack, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(encryptedBody),
        });

        if (response.ok) {
        return {
            success: true,
            data: await response.json()
        };
        } else {
        const errorData = await response.json();
        if (errorData.encrypted) {
            const decrypted = decryptResponse(errorData);
            return {
            success: false,
            message: decrypted?.message || "Unknown encrypted error"
            };
        }
        return {
            success: false,
            message: "Failed to submit"
        };
        }
    } catch (err) {
        console.error("Request failed:", err);
        return {
        success: false,
        message: "Network error or unexpected failure"
        };
    }
};

export const codeExecuteService = async (payload = {}) => {
    try {
        const encryptedBody = encryptRequest(payload);

        const response = await fetch(apis.codeExecute, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(encryptedBody),
          });

        if (response.ok) {
        return {
            success: true,
            data: await response.json()
        };
        } else {
        const errorData = await response.json();
        if (errorData.encrypted) {
            const decrypted = decryptResponse(errorData);
            return {
            success: false,
            message: decrypted?.output || "Unknown encrypted error"
            };
        }
        return {
            success: false,
            message: "Failed to submit"
        };
        }
    } catch (err) {
        console.error("Request failed:", err);
        return {
        success: false,
        message: "Network error or unexpected failure"
        };
    }
};
  