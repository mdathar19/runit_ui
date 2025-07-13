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
export const getUIBaseUrl = () => {
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
  sendPasswordOtp: `${baseUrl}/v1/send-password-otp`,
  confirmNewPassword: `${baseUrl}/v1/confirm-new-password`,
  getUserInfo: `${baseUrl}/v1/user-info`,
  signup: `${baseUrl}/v1/signup`,
  generatePortfolio:`${baseUrl}/v1/generate-portfolios`,
  publishPortfolio: `${baseUrl}/v1/publish-portfolio`,
  getUserPortfolios: `${baseUrl}/v1/user-portfolios`,
  portfoliosStats : `${baseUrl}/v1/portfolio-stats`,
  deletePortfolios:`${baseUrl}/v1/portfolios-delete`,
  checkWebsiteName: `${baseUrl}/v1/check-website-name`,
  extractResume: `${baseUrl}/v1/parse-resume`,
  enhanceHtml: `${baseUrl}/v1/enhance-html`,
  uploadImage: `${baseUrl}/v1/upload-image`,
  templateList: `${baseUrl}/template-list`,

  // credits endpoints
  getCreditInfo: `${baseUrl}/v1/credits/info`,
  getMyCredits: `${baseUrl}/v1/credits/my-credits`,
  createCreditOrder: `${baseUrl}/v1/credits/create-order`,
  verifyCreditPayment: `${baseUrl}/v1/credits/verify-payment`,
  getCreditPackages: `${baseUrl}/v1/credits/packages`,

  // Payment endpoints
  getAllPlans: `${baseUrl}/payment-plans`,
  getPlanById: (planId) => `${baseUrl}/payment-plans/${planId}`,
  createOrder: `${baseUrl}/create-order`,
  verifyPayment: `${baseUrl}/verify-payment`,

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
  