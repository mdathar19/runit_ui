const getBaseUrl = () => {
    if (typeof window !== 'undefined') {
      // Running in browser
      if (window.location.hostname === 'localhost') {
        return 'https://api.runit.in';
      } else {
        return 'https://api.runit.in'; // Empty base URL, use relative path in production
      }
    } else {
      // Running in server-side rendering (optional handling)
      return '';
    }
  };
  const getUIBaseUrl = () => {
    if (typeof window !== 'undefined') {
      // Running in browser
      if (window.location.hostname === 'localhost') {
        return 'http://localhost:3001';
      } else {
        return 'https://runit.in'; // Empty base URL, use relative path in production
      }
    } else {
      // Running in server-side rendering (optional handling)
      return '';
    }
  };
export const portfolioUrl = `${getUIBaseUrl()}/portfolio/create`;
export const publishedPortfolioUrl = `${getBaseUrl()}`;
const baseUrl = getBaseUrl();
  
const apis = {
  postFeedBack: `${baseUrl}/feedback`,
  codeExecute: `${baseUrl}/execute`,
  askGPT: `${baseUrl}/ask`,
  verifyOtp: `${baseUrl}/v1/verify-otp`,
  login: `${baseUrl}/v1/login`,
  signup: `${baseUrl}/v1/signup`,
  publishPortfolio: `${baseUrl}/v1/publish-portfolio`,
  getUserPortfolios: `${baseUrl}/v1/user-portfolios`,
  checkWebsiteName: `${baseUrl}/v1/check-website-name`,
  extractResume: `${baseUrl}/v1/parse-resume`,
  enhanceHtml: `${baseUrl}/v1/enhance-html`,
  uploadImage: `${baseUrl}/v1/upload-image`,

  // Payment endpoints
  getAllPlans: `${baseUrl}/payment-plans`,
  getPlanById: (planId) => `${baseUrl}/payment-plans/${planId}`,
  createOrder: `${baseUrl}/create-order`,
  verifyPayment: `${baseUrl}/verify-payment`,
  subscribeFree: `${baseUrl}/subscribe-free`,
  getMySubscriptions: `${baseUrl}/my-subscriptions`,
  getPaymentHistory: `${baseUrl}/payment-history`,
  getPaymentStatus: (paymentId) => `${baseUrl}/payment-status/${paymentId}`,
  initiateRefund: `${baseUrl}/refund`,
  getSubscriptionStatus: `${baseUrl}/subscription-status`,

  // Usage endpoints
  getMyUsage: `${baseUrl}/my-usage`,
  getAllUsageStats: `${baseUrl}/admin/all-usage`,
  getDashboardStats: `${baseUrl}/admin/dashboard`,
  exportUsageData: `${baseUrl}/admin/export`,
};

// Create an axios instance or fetch wrapper
export const api = {
  get: async (endpoint, options = {}) => {
    const response = await fetch(endpoint.startsWith('http') ? endpoint : apis[endpoint], {
      ...options,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    return response.json();
  },
  post: async (endpoint, data = {}, options = {}) => {
    const response = await fetch(endpoint.startsWith('http') ? endpoint : apis[endpoint], {
      ...options,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },
};

export default apis;
  