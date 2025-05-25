'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createOrder, verifyPayment, clearPaymentState, fetchAllPlans, setSelectedPlan, subscribeFree } from '@/redux/slices/paymentSlice';
import { fetchUserUsage } from '@/redux/slices/usageSlice';
import { FaCheck, FaCrown, FaStar, FaShield, FaRocket, FaGem, FaInfinity, FaLock, FaSparkles } from 'react-icons/fa';
import useReduxStore from '@/hooks/useReduxStore';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import LuxuryButton from '@/components/global/LuxuryButton';
import useCurrencyConverter from '@/hooks/useCurrencyConverter';

function Plans() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { plans: availablePlans } = useSelector((state) => state.payment);
  const [isProcessing, setIsProcessing] = useState(false);
  const { formatAmount, currency, isLoading: currencyLoading } = useCurrencyConverter();

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { loading, error, order } = useSelector((state) => state.payment);
  const { userUsage } = useSelector((state) => state.usage);
  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    // Fetch user usage if authenticated
    if (isAuthenticated) {
      dispatch(fetchUserUsage());
    }

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [isAuthenticated, dispatch]);

  useEffect(() => {
    // Fetch plans using Redux action
    dispatch(fetchAllPlans());
  }, [dispatch]);

  const handlePlanSelect = async (plan) => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    dispatch(setSelectedPlan(plan));

    // If free plan, use the subscribeFree action
    if (plan.name === 'free') {
      try {
        router.push('/portfolio/templates-list');
      } catch (error) {
        console.error('Error subscribing to free plan:', error);
      }
      return;
    }

    setIsProcessing(true);
    try {
      const result = await dispatch(createOrder({ planId: plan._id })).unwrap();
      if (result.success) {
        initializeRazorpay(result);
      }
    } catch (error) {
      console.error('Error creating order:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const initializeRazorpay = (orderData) => {
    const options = {
      key: orderData.key_id,
      amount: orderData.order.amount,
      currency: orderData.order.currency,
      name: 'RunIt Portfolio',
      description: `${orderData.plan.name} Subscription`,
      order_id: orderData.order.id,
      handler: async function (response) {
        try {
          const result = await dispatch(verifyPayment({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          })).unwrap();

          if (result.success) {
            router.push('/portfolio/templates-list');
          }
        } catch (error) {
          console.error('Payment verification failed:', error);
        }
      },
      prefill: {
        name: user?.name || '',
        email: user?.email || '',
      },
      theme: {
        color: '#6366f1',
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  // Get plan icon based on plan name
  const getPlanIcon = (planName) => {
    switch (planName?.toLowerCase()) {
      case 'free':
        return <FaStar className="w-8 h-8 text-blue-400" />;
      case 'basic':
        return <FaRocket className="w-8 h-8 text-green-400" />;
      case 'professional':
        return <FaCrown className="w-8 h-8 text-yellow-400" />;
      case 'premium':
        return <FaGem className="w-8 h-8 text-purple-400" />;
      case 'enterprise':
        return <FaRocket className="w-8 h-8 text-red-400" />;
      default:
        return <FaRocket className="w-8 h-8 text-red-400" />;
    }
  };

  // Get plan variant for button styling
  const getPlanVariant = (planName, isPopular) => {
    if (isPopular) return 'gold';
    
    switch (planName?.toLowerCase()) {
      case 'free':
        return 'elegant';
      case 'basic':
        return 'premium';
      case 'professional':
        return 'gold';
      case 'premium':
        return 'platinum';
      case 'enterprise':
        return 'primary';
      default:
        return 'premium';
    }
  };

  // Animation variants for cards
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
    hover: { 
      y: -12, 
      scale: 1.03,
      transition: { duration: 0.3, ease: "easeOut" }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  if (currencyLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-400 mx-auto mb-4"></div>
          <p className="text-white font-luxury text-xl">Loading pricing information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
      <div className="absolute top-40 right-20 w-32 h-32 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-2xl opacity-20 animate-pulse" style={{ animationDelay: '1000ms' }}></div>
      <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full blur-xl opacity-20 animate-pulse" style={{ animationDelay: '2000ms' }}></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header Section */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-luxury font-bold text-white mb-6 leading-tight">
              Choose Your
              <span className="bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 bg-clip-text text-transparent block">
                Destiny
              </span>
            </h1>
            <p className="text-xl md:text-2xl font-elegant text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Elevate your portfolio to extraordinary heights with our meticulously crafted plans. 
              Each tier is designed to unlock new possibilities and showcase your brilliance.
            </p>
          </motion.div>

          {/* Currency Display */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-8 inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20"
          >
            <FaInfinity className="w-5 h-5 text-amber-400 mr-3" />
            <span className="text-white font-modern">
              Pricing displayed in <strong>{currency}</strong>
              {currency === 'USD' && ' (converted from INR)'}
            </span>
          </motion.div>
        </div>

        {/* Plans Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-8 md:gap-12 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3"
        >
          {availablePlans && availablePlans.length > 0 ? availablePlans.map((plan, index) => {
            const isPopular = plan.name === 'professional';
            const planVariant = getPlanVariant(plan.name, isPopular);
            
            return (
              <motion.div
                key={plan._id}
                variants={cardVariants}
                whileHover="hover"
                className={`
                  relative luxury-card
                `}
              >
                <div className={`
                  relative h-full rounded-3xl overflow-hidden
                  ${isPopular 
                    ? 'bg-gradient-to-br from-gray-900/50 via-slate-800/50 to-gray-900/50' 
                    : 'bg-gradient-to-br from-gray-900/50 via-slate-800/50 to-gray-900/50'
                  }
                  backdrop-blur-xl border-2 
                  ${isPopular ? 'border-white/10' : 'border-white/10'}
                  shadow-2xl hover:shadow-3xl transition-all duration-500
                `}>
                  
                  {/* Popular Badge */}
                  {/* {isPopular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-50">
                      <div className="bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 text-black px-6 py-2 rounded-full font-bold text-sm shadow-lg flex items-center">
                        <FaCrown className="mr-2" /> Most Popular
                      </div>
                    </div>
                  )} */}

                  {/* Card Content */}
                  <div className="p-8 h-full flex flex-col">
                    {/* Plan Header */}
                    <div className="text-center mb-8">
                      <div className="flex justify-center mb-4">
                        {getPlanIcon(plan.name)}
                      </div>
                      <h3 className="text-3xl font-luxury font-bold text-white mb-3">
                        {plan.displayName || plan.name}
                      </h3>
                      <p className="text-gray-300 font-elegant text-lg leading-relaxed min-h-[60px] flex items-center justify-center">
                        {plan.description}
                      </p>
                    </div>

                    {/* Pricing */}
                    <div className="text-center mb-8">
                      <div className="flex items-baseline justify-center">
                        <span className="text-5xl md:text-6xl font-bold text-white font-luxury">
                          {formatAmount(plan.amount)}
                        </span>
                        {plan.duration && plan.duration.value > 0 && (
                          <span className="text-gray-400 ml-2 font-modern">
                            /{plan.duration.value} {plan.duration.unit}
                          </span>
                        )}
                      </div>
                      {plan.name === 'free' && (
                        <p className="text-amber-400 font-semibold mt-2">Forever Free</p>
                      )}
                    </div>

                    {/* Features */}
                    <div className="flex-grow">
                      <ul className="space-y-4 mb-8">
                        {plan.features && plan.features.map((feature, featureIndex) => (
                          <motion.li
                            key={featureIndex}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 + featureIndex * 0.1 }}
                            className="flex items-start"
                          >
                            <FaCheck className="flex-shrink-0 w-5 h-5 text-emerald-400 mt-1 mr-4" />
                            <span className="text-gray-200 font-modern leading-relaxed">
                              {feature}
                            </span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>

                    {/* CTA Button */}
                    <div className="mt-auto">
                      <LuxuryButton
                        onClick={() => handlePlanSelect(plan)}
                        disabled={isProcessing || loading}
                        isLoading={isProcessing || loading}
                        variant={planVariant}
                        size="lg"
                        className="w-full"
                      >
                        {isProcessing || loading
                          ? 'Processing...'
                          : plan.name === 'free'
                          ? 'Begin Your Journey'
                          : 'Claim This Power'}
                      </LuxuryButton>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          }) : (
            <div className="col-span-full text-center py-12">
              <FaLock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-300 font-modern text-lg">
                {loading ? 'Loading plans...' : 'No plans available at the moment.'}
              </p>
            </div>
          )}
        </motion.div>

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 text-center"
          >
            <div className="bg-red-900/50 border border-red-500/50 text-red-200 p-6 rounded-2xl backdrop-blur-sm max-w-md mx-auto">
              <FaLock className="w-6 h-6 mx-auto mb-2" />
              <p className="font-modern">{error}</p>
            </div>
          </motion.div>
        )}

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-20 text-center"
        >
          <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm rounded-3xl p-12 border border-white/10">
            <h3 className="text-3xl font-luxury font-semibold text-white mb-6">
              Need Guidance on Your Path?
            </h3>
            <p className="text-xl text-gray-300 font-elegant max-w-3xl mx-auto leading-relaxed mb-8">
              Our dedicated concierge team is ready to help you select the perfect plan 
              that aligns with your vision and ambitions. Experience white-glove service 
              that matches your exceptional standards.
            </p>
            <LuxuryButton variant="elegant" size="lg">
              Speak with a Specialist
            </LuxuryButton>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default useReduxStore(Plans);