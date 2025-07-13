"use client"
import React from 'react'
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Code, ArrowRight, Play, CheckCircle, Bot } from 'lucide-react';
import { codeExamples, features } from '@/utils/landing';
import { useEffect, useState } from 'react';
import { FaBolt } from 'react-icons/fa';
import Login from '../Login';
import { useSelector } from 'react-redux';
import useReduxStore from '@/hooks/useReduxStore';


const HeroSection = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [nextAction, setNextAction] = useState(null);
  const {
      isAuthenticated,
      token
  } = useSelector((state) => state.auth);
    // Typing animation effect
  useEffect(() => {
      setIsVisible(true);
    
      const contents = [
        "find duplicates",
        "bubble_sort example",
        "factorial function",
      ];
    
      let contentIndex = 0;
      let charIndex = 0;
      let currentText = contents[contentIndex];
    
      const typeInterval = setInterval(() => {
        if (charIndex <= currentText.length) {
          setTypedText(currentText.slice(0, charIndex));
          charIndex++;
        } else {
          // Wait 1 second before switching to the next content
          setTimeout(() => {
            contentIndex = (contentIndex + 1) % contents.length;
            currentText = contents[contentIndex];
            charIndex = 0;
          }, 2000);
        }
      }, 100);
    
      return () => clearInterval(typeInterval);
    }, []);
      
  
    // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [features.length]);
  const handleCodingFree = (href) => {
      window.open(href, '_blank');
    };
  const handleViewSamples = (href) => {
      window.open(href, '_blank');
    };
  const handleCreateByAI = () => {
      if(!isAuthenticated){
        setShowLoginModal(true);
        setNextAction('Create by AI Agents')
      }
  }
   const handleLoginSuccess = (token) => {
        setShowLoginModal(false);
        // No need to manually set auth state as it's handled in the redux slice
        // Continue with export if that's what user was trying to do
        if (token) {
          if(nextAction === 'Create by AI Agents') {
              window.open('/AI-agent/portfolio-generator', '_blank');
          }
        }
    };
  return (
    <div>
      <motion.section 
        className="relative pt-20 pb-16 md:pt-32 md:pb-24"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-blue-900/20 to-cyan-900/20"></div>
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            opacity: 0.3
          }}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center">
            <motion.div 
              className="lg:w-1/2 mb-12 lg:mb-0"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="mb-6">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-900/30 text-purple-300 border border-purple-500/30">
                  <Sparkles className="h-4 w-4 mr-2" />
                  All-in-One Development Platform
                </span>
              </div>
              
              <h1 className="font-elegant text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Code, Create, and 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400"> Deploy</span> in Minutes
              </h1>
              
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                The ultimate development platform with AI-powered coding assistance, beautiful snippet creation, and instant portfolio generation. Everything you need to build, showcase, and share your work.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <motion.button
                  onClick={() => handleCreateByAI()}
                  className="cursor-pointer bg-gradient-to-r from-purple-600 to-violet-800 hover:from-purple-700 hover:to-violet-900 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaBolt className="mr-2 h-5 w-5" /> Create by AI agents
                </motion.button>
                
                <motion.button
                  onClick={() => handleCodingFree('/portfolio/templates-list')}
                  className="cursor-pointer border border-gray-600 hover:border-gray-500 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 flex items-center justify-center backdrop-blur-sm bg-gray-800/20"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Host Portfolio Free<ArrowRight className="ml-2 h-5 w-5" />
                </motion.button>
              </div>
              
              <div className="flex items-center space-x-6 text-sm text-gray-400">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  No Credit Card Required
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Free Forever Plan
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="lg:w-1/2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="relative">
                {/* Main demo window */}
                <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-xl shadow-2xl overflow-hidden">
                  {/* Window header */}
                  <div className="bg-gray-800 px-4 py-3 flex items-center space-x-2 border-b border-gray-700">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="flex-1 text-center">
                      <span className="text-gray-400 text-sm">RunIt - Online IDE</span>
                    </div>
                  </div>
                  
                  {/* AI Assistant Demo */}
                  <div className="p-4">
                    <div className="mb-4">
                      <div className="bg-gray-800 rounded-lg p-3 mb-3">
                        <div className="flex items-center mb-2">
                          <Bot className="h-4 w-4 text-purple-400 mr-2" />
                          <span className="text-sm text-gray-400">AI Assistant</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-300">{typedText}</span>
                          <span className="animate-pulse">|</span>
                        </div>
                      </div>
                      
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={activeFeature}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.5 }}
                          className="bg-gray-800 rounded-lg p-4"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-green-400">Generated Code</span>
                            <button className="text-xs bg-purple-600 hover:bg-purple-700 px-2 py-1 rounded transition-colors">
                              Insert into Editor
                            </button>
                          </div>
                          <pre className="text-xs text-gray-300 font-mono overflow-x-auto">
                            <code>{codeExamples[activeFeature % codeExamples.length]}</code>
                          </pre>
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
                
                {/* Floating elements */}
                <motion.div
                  className="absolute -top-4 -right-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-3 shadow-lg"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="h-6 w-6 text-white" />
                </motion.div>
                
                <motion.div
                  className="absolute -bottom-4 -left-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg p-3 shadow-lg"
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                >
                  <Code className="h-6 w-6 text-white" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>
      <Login
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={handleLoginSuccess}
          nextAction={nextAction}
      />
    </div>
  )
}

export default useReduxStore(HeroSection);
