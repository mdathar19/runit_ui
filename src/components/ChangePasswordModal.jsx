import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaEnvelope, FaLock, FaSpinner, FaKey } from 'react-icons/fa';
import { confirmNewPassword, sendPasswordOtp } from '@/service/api.service';
import useReduxStore from '@/hooks/useReduxStore';

const ChangePasswordModal = ({ isOpen, onClose, userEmail }) => {
  const [step, setStep] = useState('email'); // 'email' | 'otp'
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const resetState = () => {
    setStep('email');
    setIsLoading(false);
    setError('');
    setMessage('');
    setOtp('');
    setNewPassword('');
  };

  // Send OTP handler
  const handleSendOtp = async () => {
    console.log('Sending OTP to:', userEmail);
    setIsLoading(true);
    setError('');
    setMessage('');
    try {
      // Call /send-password-otp API
      const res = await sendPasswordOtp(userEmail);
      if (res.success) {
        setMessage(res.message || 'OTP sent to your email.');
        setStep('otp');
      } else {
        setError(res.message || 'Failed to send OTP.');
      }
    } catch (err) {
      setError('Network error.');
    } finally {
      setIsLoading(false);
    }
  };

  // Confirm new password handler
  const handleConfirm = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');
    try {
      // Log the values as requested
      console.log({ email: userEmail, newPassword, otp });
      // Call /confirm-new-password API
      const res = await confirmNewPassword(userEmail, otp, newPassword);
      if (res.success) {
        setMessage(res.message || 'Password changed successfully.');
            setTimeout(() => {
                resetState();
                onClose();
            }, 1000);
      } else {
        setError(res.message || 'Failed to change password.');
      }
    } catch (err) {
      setError('Network error.');
    } finally {
      setIsLoading(false);
    }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };
  const modalVariants = {
    hidden: { opacity: 0, y: -50, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', damping: 20, stiffness: 300 } }
  };

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
          onClick={e => e.stopPropagation()}
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
              <FaKey className="text-white text-2xl" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">Change Password</h2>
            <p className="text-white/70 text-sm">
              {step === 'email' && 'Send OTP to your email to change password.'}
              {step === 'otp' && 'Enter the OTP and your new password.'}
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
            <form onSubmit={handleConfirm} className="space-y-4">
              {/* Email step */}
              {step === 'email' && (
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                    <input
                      id="email"
                      type="email"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      value={userEmail}
                      disabled
                    />
                  </div>
                  <button
                    type="button"
                    className="mt-6 ml-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-violet-800 hover:from-purple-700 hover:to-violet-900 text-white font-medium rounded-lg transition-colors flex items-center"
                    onClick={handleSendOtp}
                    disabled={isLoading}
                  >
                    {isLoading ? <FaSpinner className="animate-spin mr-2" /> : null}
                    Send OTP
                  </button>
                </div>
              )}
              {/* OTP step */}
              {step === 'otp' && (
                <>
                  <div>
                    <label htmlFor="otp" className="block text-sm font-medium text-gray-300 mb-1">OTP</label>
                    <input
                      id="otp"
                      type="text"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 text-white text-center text-xl tracking-widest font-mono focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="000000"
                      maxLength={6}
                      value={otp}
                      onChange={e => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 mb-1">New Password</label>
                    <input
                      id="newPassword"
                      type="password"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  <button
                    type="submit"
                    className={`w-full flex items-center justify-center bg-gradient-to-r from-purple-600 to-violet-800 hover:from-purple-700 hover:to-violet-900 text-white font-medium py-3 px-4 rounded-lg transition-colors ${isLoading || !otp || !newPassword ? 'opacity-70 cursor-not-allowed' : ''}`}
                    disabled={isLoading || !otp || !newPassword}
                  >
                    {isLoading ? <FaSpinner className="animate-spin mr-2" /> : null}
                    Change Password
                  </button>
                </>
              )}
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default useReduxStore(ChangePasswordModal);
