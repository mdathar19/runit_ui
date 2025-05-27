// hooks/useCurrencyConverter.js
import { useState, useEffect } from 'react';

const useCurrencyConverter = () => {
  const [exchangeRate, setExchangeRate] = useState(1);
  const [currency, setCurrency] = useState('INR');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const detectLocationAndCurrency = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // First, detect user location using a free IP geolocation service
        const locationResponse = await fetch('https://ipapi.co/json/');
        
        if (!locationResponse.ok) {
          throw new Error('Failed to detect location');
        }
        
        const locationData = await locationResponse.json();
        
        // If user is not from India, set currency to USD and fetch exchange rate
        if (locationData.country_code && locationData.country_code !== 'IN') {
          setCurrency('USD');
          
          // Fetch current exchange rate from INR to USD
          const exchangeResponse = await fetch('https://api.exchangerate-api.com/v4/latest/INR');
          
          if (!exchangeResponse.ok) {
            throw new Error('Failed to fetch exchange rate');
          }
          
          const exchangeData = await exchangeResponse.json();
          
          if (exchangeData.rates && exchangeData.rates.USD) {
            setExchangeRate(exchangeData.rates.USD);
          } else {
            // Fallback exchange rate if API doesn't return USD rate
            setExchangeRate(0.012); // Approximate INR to USD rate
          }
        } else {
          // User is from India, keep INR
          setCurrency('INR');
          setExchangeRate(1);
        }
      } catch (error) {
        console.error('Error in currency detection:', error);
        setError(error.message);
        
        // Fallback to INR on any error
        setCurrency('INR');
        setExchangeRate(1);
      } finally {
        setIsLoading(false);
      }
    };

    detectLocationAndCurrency();
  }, []);

  // Convert amount from INR paise to target currency
  const convertAmount = (amountInPaise) => {
    if (currency === 'USD') {
      return (amountInPaise / 100) * exchangeRate;
    }
    return amountInPaise / 100;
  };

  // Format amount with proper currency symbol and locale
  const formatAmount = (amountInPaise) => {
    const convertedAmount = convertAmount(amountInPaise);
    
    try {
      return new Intl.NumberFormat(currency === 'USD' ? 'en-US' : 'en-IN', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: currency === 'USD' ? 2 : 0,
        maximumFractionDigits: currency === 'USD' ? 2 : 0,
      }).format(convertedAmount);
    } catch (formatError) {
      console.error('Error formatting currency:', formatError);
      return `${currency} ${convertedAmount.toFixed(currency === 'USD' ? 2 : 0)}`;
    }
  };

  // Get currency symbol only
  const getCurrencySymbol = () => {
    return currency === 'USD' ? '$' : '₹';
  };

  return {
    formatAmount,
    convertAmount,
    getCurrencySymbol,
    currency,
    exchangeRate,
    isLoading,
    error
  };
};

export default useCurrencyConverter;