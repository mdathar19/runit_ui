import apis from '@/api';
import React, { useState, useEffect } from 'react';
import { FaTimes, FaCoins, FaCreditCard, FaSpinner, FaCheck, FaStar } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import Login from '../Login';

const CreditRechargeModal = ({ isOpen, onClose, onSuccess, currentCredits }) => {
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [razorpayLoaded, setRazorpayLoaded] = useState(false);
    const [creditPackages, setCreditPackages] = useState([]);
    const [loadingPackages, setLoadingPackages] = useState(false);
    const [nextAction] = useState('Recharge Credit');
    const {
        token
    } = useSelector((state) => state.auth);
    
    // Load credit packages from API
    const loadCreditPackages = async () => {
        setLoadingPackages(true);
        try {
        const response = await fetch(apis.getCreditPackages);
        const data = await response.json();
        
        if (data.success) {
            setCreditPackages(data.packages);
        } else {
            // Fallback to hardcoded packages with new pricing
            setCreditPackages([
            { 
                id: 1, 
                credits: 1, 
                price: 199, 
                popular: false,
                description: 'Perfect for trying out',
                savings: 0
            },
            { 
                id: 2, 
                credits: 5, 
                price: 899, 
                popular: true, 
                savings: 10,
                description: 'Most popular choice'
            },
            { 
                id: 3, 
                credits: 10, 
                price: 1699, 
                popular: false, 
                savings: 15,
                description: 'Great for regular use'
            },
            { 
                id: 4, 
                credits: 25, 
                price: 3999, 
                popular: false, 
                savings: 20,
                description: 'Best value for power users'
            },
            ]);
        }
        } catch (error) {
        console.error('Error loading credit packages:', error);
        // Use fallback packages with new pricing
        setCreditPackages([
            { 
            id: 1, 
            credits: 1, 
            price: 199, 
            popular: false,
            description: 'Perfect for trying out',
            savings: 0
            },
            { 
            id: 2, 
            credits: 5, 
            price: 899, 
            popular: true, 
            savings: 10,
            description: 'Most popular choice'
            },
            { 
            id: 3, 
            credits: 10, 
            price: 1699, 
            popular: false, 
            savings: 15,
            description: 'Great for regular use'
            },
            { 
            id: 4, 
            credits: 25, 
            price: 3999, 
            popular: false, 
            savings: 20,
            description: 'Best value for power users'
            },
        ]);
        } finally {
        setLoadingPackages(false);
        }
    };

    // Load Razorpay script
    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
        // Check if Razorpay is already loaded
        if (window.Razorpay) {
            resolve(true);
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => {
            setRazorpayLoaded(true);
            resolve(true);
        };
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
        });
    };
    const handleLoginSuccess = (token) => {
        onClose()
    };
    // Initialize when modal opens
    useEffect(() => {
        if (isOpen) {
        loadCreditPackages();
        if (!window.Razorpay) {
            loadRazorpayScript();
        } else {
            setRazorpayLoaded(true);
        }
        }
    }, [isOpen]);

    // Reset state when modal closes
    useEffect(() => {
        if (!isOpen) {
        setSelectedPackage(null);
        setError('');
        setIsLoading(false);
        }
    }, [isOpen]);

    const handlePackageSelect = (pkg) => {
        setSelectedPackage(pkg);
        setError('');
    };

    const handlePurchase = async () => {
        if (!selectedPackage) {
        setError('Please select a credit package');
        return;
        }

        if (!razorpayLoaded) {
        setError('Payment gateway is loading. Please try again.');
        return;
        }

        setIsLoading(true);
        setError('');

        try {
        // Create order on backend
        const orderResponse = await fetch(apis.createCreditOrder, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
            credits: selectedPackage.credits
            })
        });

        const orderData = await orderResponse.json();

        if (!orderData.success) {
            throw new Error(orderData.message || 'Failed to create order');
        }

        // Configure Razorpay options
        const options = {
            key: orderData.razorpayKeyId,
            amount: orderData.amount,
            currency: orderData.currency,
            name: 'Portfolio Builder',
            description: `${selectedPackage.credits} Credits - AI Enhancement`,
            order_id: orderData.orderId,
            handler: async function (response) {
            // Payment successful, verify on backend
            try {
                const verifyResponse = await fetch(apis.verifyCreditPayment, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_signature: response.razorpay_signature
                })
                });

                const verifyData = await verifyResponse.json();

                if (verifyData.success) {
                // Success - close modal and call success callback
                onSuccess();
                onClose();
                } else {
                setError(verifyData.message || 'Payment verification failed');
                }
            } catch (error) {
                console.error('Payment verification error:', error);
                setError('Payment verification failed. Please contact support.');
            } finally {
                setIsLoading(false);
            }
            },
            prefill: {
            name: '',
            email: '',
            contact: ''
            },
            theme: {
            color: '#8B5CF6'
            },
            modal: {
            ondismiss: function() {
                setIsLoading(false);
            }
            }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();

        } catch (error) {
        console.error('Purchase error:', error);
        setError(error.message || 'Failed to process purchase');
        setIsLoading(false);
        }
    };
  if (!isOpen) return null;
  if (!token) return <Login
          isOpen={true}
          onClose={onClose}
          onLoginSuccess={handleLoginSuccess}
          nextAction={nextAction}
        />;
  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-2 rounded-lg">
              <FaCoins className="text-white text-xl" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Recharge Credits</h2>
              <p className="text-gray-600">Current Balance: {currentCredits} credits</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            disabled={isLoading}
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Info Section */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <div className="bg-purple-100 p-2 rounded-lg">
                <FaCreditCard className="text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">AI Enhancement Credits</h3>
                <p className="text-gray-600 text-sm">
                  Each credit allows you to enhance your portfolio with AI. Our AI analyzes your resume and 
                  automatically fills in your portfolio template with relevant information.
                </p>
              </div>
            </div>
          </div>

          {/* Package Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Your Package</h3>
            
            {loadingPackages ? (
              <div className="flex items-center justify-center py-8">
                <FaSpinner className="animate-spin text-purple-500 text-2xl" />
                <span className="ml-2 text-gray-600">Loading packages...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {creditPackages.map((pkg) => (
                  <div
                    key={pkg.id}
                    onClick={() => handlePackageSelect(pkg)}
                    className={`relative cursor-pointer rounded-lg border-2 transition-all duration-200 ${
                      selectedPackage?.id === pkg.id
                        ? 'border-purple-500 bg-purple-50 shadow-lg'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                    }`}
                  >
                    {pkg.popular && (
                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                        <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
                          <FaStar className="text-xs" />
                          <span>Popular</span>
                        </div>
                      </div>
                    )}
                    
                    <div className="p-4 text-center">
                      <div className="mb-2">
                        <div className="text-2xl font-bold text-gray-900">{pkg.credits}</div>
                        <div className="text-sm text-gray-500">
                          {pkg.credits === 1 ? 'Credit' : 'Credits'}
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <div className="text-xl font-bold text-gray-900">₹{pkg.price}</div>
                        {pkg.savings > 0 && (
                          <div className="text-xs text-green-600 font-semibold">
                            Save {pkg.savings}%
                          </div>
                        )}
                      </div>
                      
                      <div className="text-xs text-gray-600 mb-3">
                        {pkg.description}
                      </div>
                      
                      <div className="text-xs text-gray-500">
                        ₹{Math.round(pkg.price / pkg.credits)} per credit
                      </div>
                    </div>
                    
                    {selectedPackage?.id === pkg.id && (
                      <div className="absolute top-2 right-2">
                        <div className="bg-purple-500 text-white rounded-full p-1">
                          <FaCheck className="text-xs" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Purchase Button */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              onClick={handlePurchase}
              disabled={!selectedPackage || isLoading || !razorpayLoaded || loadingPackages}
              className={`px-6 py-2 cursor-pointer rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2 ${
                selectedPackage && !isLoading && razorpayLoaded && !loadingPackages
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600 shadow-lg'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <FaCreditCard />
                  <span>
                    {selectedPackage 
                      ? `Pay ₹${selectedPackage.price}` 
                      : 'Select Package'
                    }
                  </span>
                </>
              )}
            </button>
          </div>

          {/* Security Note */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 text-center">
              🔒 Secure payment powered by Razorpay. Your payment information is encrypted and secure.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditRechargeModal;