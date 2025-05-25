'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaEnvelope, FaLock, FaSpinner } from 'react-icons/fa';
import { 
  signupUser, 
  loginUser, 
  verifyOtp, 
  setStep, 
  resetAuth 
} from '@/redux/slices/authSlice';

const Login = ({ isOpen, onClose, onLoginSuccess, nextAction }) => {
  const dispatch = useDispatch();
  const { 
    step, 
    isLoading, 
    error, 
    message, 
    isAuthenticated, 
    token 
  } = useSelector(state => state.auth);

  // Setup react-hook-form with validation
  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    setFocus,
    reset,
    watch
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
      otp: ''
    }
  });

  // Reset form when modal is opened
  useEffect(() => {
    if (isOpen) {
      dispatch(resetAuth());
      reset();
    }
  }, [isOpen, dispatch, reset]);

  // Set focus on the appropriate field based on current step
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        if (step === 'email') setFocus('email');
        if (step === 'password') setFocus('password');
        if (step === 'otp') setFocus('otp');
      }, 100);
    }
  }, [step, isOpen, setFocus]);

  // If authenticated, call onLoginSuccess callback
  useEffect(() => {
    if (isOpen && isAuthenticated && token) {
      onLoginSuccess(token);
    }
  }, [isOpen, isAuthenticated, token]);

  // Form submission handler
  const onSubmit = (data) => {
    if (step === 'email') {
      dispatch(signupUser(data.email));
    } else if (step === 'password') {
      dispatch(loginUser({ email: data.email, password: data.password }));
    } else if (step === 'otp') {
      dispatch(verifyOtp({ email: data.email, otp: data.otp }));
    }
  };

  // Go back to email step
  const handleBack = () => {
    dispatch(setStep('email'));
  };

  // Modal animations
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modalVariants = {
    hidden: { opacity: 0, y: -50, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', damping: 20, stiffness: 300 } }
  };

  // Watch form values for validation
  const email = watch('email');
  const password = watch('password');
  const otp = watch('otp');

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm"
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={overlayVariants}
        onClick={onClose}
      >
        <motion.div
          className="bg-gray-900 border border-gray-800 rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden"
          variants={modalVariants}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative bg-gradient-to-r from-purple-800 to-violet-900 px-6 py-8 text-center">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
              aria-label="Close"
            >
              <FaTimes />
            </button>
            
            <div className="mx-auto w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mb-4">
              {step === 'email' && <FaEnvelope className="text-white text-2xl" />}
              {step === 'password' && <FaLock className="text-white text-2xl" />}
              {step === 'otp' && (
                <div className="text-white text-2xl font-mono font-bold">OTP</div>
              )}
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-1">
              {step === 'email' && `Sign in to ${nextAction}`}
              {step === 'password' && 'Enter your password'}
              {step === 'otp' && 'Verify your email'}
            </h2>
            
            <p className="text-white/70 text-sm">
              {step === 'email' && 'Enter your email to continue'}
              {step === 'password' && 'Please enter your password to login'}
              {step === 'otp' && 'Enter the code sent to your email'}
            </p>
          </div>
          
          {/* Form */}
          <div className="p-6">
            {message && (
              <div className="mb-4 p-3 bg-green-900/30 border border-green-800 rounded-lg text-green-400 text-sm">
                {message}
              </div>
            )}
            
            {error && (
              <div className="mb-4 p-3 bg-red-900/30 border border-red-800 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {step === 'email' && (
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      type="email"
                      className={`w-full bg-gray-800 border ${
                        errors.email ? 'border-red-500' : 'border-gray-700'
                      } rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                      placeholder="your@email.com"
                      {...register('email', { 
                        required: 'Email is required', 
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address'
                        }
                      })}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <FaEnvelope className="text-gray-500" />
                    </div>
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
                  )}
                </div>
              )}
              
              {step === 'password' && (
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={handleBack}
                      className="text-xs text-purple-400 hover:text-purple-300"
                    >
                      Change email
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      id="password"
                      type="password"
                      className={`w-full bg-gray-800 border ${
                        errors.password ? 'border-red-500' : 'border-gray-700'
                      } rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                      placeholder="Enter your password"
                      {...register('password', { 
                        required: 'Password is required'
                      })}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <FaLock className="text-gray-500" />
                    </div>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>
                  )}
                </div>
              )}
              
              {step === 'otp' && (
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label htmlFor="otp" className="block text-sm font-medium text-gray-300">
                      Verification Code
                    </label>
                    <button
                      type="button"
                      onClick={handleBack}
                      className="text-xs text-purple-400 hover:text-purple-300"
                    >
                      Change email
                    </button>
                  </div>
                  <input
                    id="otp"
                    type="text"
                    className={`w-full bg-gray-800 border ${
                      errors.otp ? 'border-red-500' : 'border-gray-700'
                    } rounded-lg py-3 px-4 text-white text-center text-xl tracking-widest font-mono focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                    placeholder="000000"
                    maxLength={6}
                    {...register('otp', { 
                      required: 'OTP is required',
                      pattern: {
                        value: /^[0-9]{6}$/,
                        message: 'OTP must be 6 digits'
                      }
                    })}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Only allow numbers
                      e.target.value = value.replace(/[^0-9]/g, '');
                    }}
                  />
                  {errors.otp && (
                    <p className="mt-1 text-sm text-red-400">{errors.otp.message}</p>
                  )}
                </div>
              )}
              
              <button
                type="submit"
                className={`w-full flex items-center justify-center bg-gradient-to-r from-purple-600 to-violet-800 hover:from-purple-700 hover:to-violet-900 text-white font-medium py-3 px-4 rounded-lg transition-colors ${
                  isLoading || 
                  (step === 'email' && (!email || errors.email)) ||
                  (step === 'password' && (!password || errors.password)) ||
                  (step === 'otp' && (!otp || errors.otp))
                    ? 'opacity-70 cursor-not-allowed'
                    : ''
                }`}
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    {step === 'email' && 'Checking...'}
                    {step === 'password' && 'Logging in...'}
                    {step === 'otp' && 'Verifying...'}
                  </>
                ) : (
                  <>
                    {step === 'email' && 'Continue'}
                    {step === 'password' && 'Login'}
                    {step === 'otp' && 'Verify'}
                  </>
                )}
              </button>
            </form>
            
            <div className="mt-6 text-center text-sm text-gray-500">
              By continuing, you agree to our{' '}
              <a href="#" className="text-purple-400 hover:text-purple-300">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-purple-400 hover:text-purple-300">
                Privacy Policy
              </a>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Login;
