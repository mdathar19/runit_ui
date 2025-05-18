const getBaseUrl = () => {
    if (typeof window !== 'undefined') {
      // Running in browser
      if (window.location.hostname === 'localhost') {
        return 'http://localhost:3000';
      } else {
        return 'https://website.runit.in'; // Empty base URL, use relative path in production
      }
    } else {
      // Running in server-side rendering (optional handling)
      return '';
    }
  };
  
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
  };
  
  export default apis;
  