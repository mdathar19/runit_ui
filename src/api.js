const getBaseUrl = () => {
    if (typeof window !== 'undefined') {
      // Running in browser
      if (window.location.hostname === 'localhost') {
        return 'http://localhost:3000';
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
    askGPT: `${baseUrl}/ask`,
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
  };
  
  export default apis;
  