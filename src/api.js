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
  
  const baseUrl = getBaseUrl();
  
  const apis = {
    postFeedBack: `${baseUrl}/feedback`,
    codeExecute: `${baseUrl}/execute`,
    askGPT: `${baseUrl}/ask`,
  };
  
  export default apis;
  