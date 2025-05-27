"use client"
import React from 'react';
import { motion } from 'framer-motion';
import { Cookie, Settings, Clock, Shield, Bell } from 'lucide-react';

const CookiePolicy = () => {
  const sections = [
    {
      title: "Types of Cookies We Use",
      icon: <Cookie className="h-6 w-6" />,
      content: [
        "Essential cookies for site functionality",
        "Analytics cookies to understand usage",
        "Preference cookies to remember settings",
        "Authentication cookies for login",
        "Performance cookies for optimization"
      ]
    },
    {
      title: "Cookie Management",
      icon: <Settings className="h-6 w-6" />,
      content: [
        "Control cookie settings in preferences",
        "Choose which cookies to accept",
        "Clear cookies from your browser",
        "Opt-out of non-essential cookies",
        "Update preferences anytime"
      ]
    },
    {
      title: "Cookie Duration",
      icon: <Clock className="h-6 w-6" />,
      content: [
        "Session cookies (temporary)",
        "Persistent cookies (stored longer)",
        "Third-party cookie lifespans",
        "Regular cookie cleanup",
        "Automatic expiration periods"
      ]
    },
    {
      title: "Your Cookie Choices",
      icon: <Settings className="h-6 w-6" />,
      content: [
        "Accept all cookies",
        "Reject non-essential cookies",
        "Customize cookie preferences",
        "Change settings anytime",
        "Browser-level controls"
      ]
    }
  ];

  return (
    <div className="bg-gradient-to-b from-black to-gray-900 text-white">
      <div className="inset-0 bg-gradient-to-r from-purple-900/20 via-blue-900/20 to-cyan-900/20">
      <div className="z-10 ">
        <div className="container mx-auto px-4 py-16">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-purple-900/30 rounded-full">
                <Cookie className="h-8 w-8 text-purple-400" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Cookie Policy</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Learn about how we use cookies to improve your experience on RunIt.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {sections.map((section, index) => (
              <motion.div
                key={section.title}
                className="luxury-card p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="flex items-center mb-6">
                  <div className="p-2 bg-purple-900/30 rounded-lg mr-4">
                    {section.icon}
                  </div>
                  <h2 className="text-2xl font-semibold">{section.title}</h2>
                </div>
                <ul className="space-y-3">
                  {section.content.map((item, i) => (
                    <li key={i} className="flex items-start">
                      <div className="h-2 w-2 bg-purple-500 rounded-full mt-2 mr-3" />
                      <span className="text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <motion.div 
            className="mt-16 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <p className="text-gray-400 max-w-3xl mx-auto">
              Last updated: May 2025. For any questions about our cookie policy, please contact no-reply@runit.in
            </p>
          </motion.div>

          <motion.div
            className="mt-8 flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
          </motion.div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default CookiePolicy;
