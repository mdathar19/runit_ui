"use client"
import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, UserCheck, Server, Bell } from 'lucide-react';

const PrivacyPolicy = () => {
  const sections = [
    {
      title: "Information We Collect",
      icon: <Eye className="h-6 w-6" />,
      content: [
        "Account information (email, name, profile data)",
        "Usage data (how you interact with our services)",
        "Code and project data",
        "Technical information (IP address, browser type)",
        "Cookies and similar tracking technologies"
      ]
    },
    {
      title: "How We Use Your Information",
      icon: <Server className="h-6 w-6" />,
      content: [
        "Provide and improve our services",
        "Personalize your experience",
        "Send important notifications",
        "Analyze usage patterns",
        "Ensure platform security"
      ]
    },
    {
      title: "Data Protection",
      icon: <Shield className="h-6 w-6" />,
      content: [
        "Industry-standard encryption",
        "Regular security audits",
        "Secure data storage",
        "Access controls",
        "Continuous monitoring"
      ]
    },
    {
      title: "Your Rights",
      icon: <UserCheck className="h-6 w-6" />,
      content: [
        "Access your personal data",
        "Request data correction",
        "Delete your account",
        "Export your data",
        "Opt-out of communications"
      ]
    }
  ];

  return (
    <div className="bg-gradient-to-b from-black to-gray-900 text-white">
      <div className=" inset-0">
        <div className=" inset-0 bg-gradient-to-r from-purple-900/20 via-blue-900/20 to-cyan-900/20" />
        <div 
          className=" inset-0" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            opacity: 0.3
          }}
        />
      

      <div className=" z-10">
        <div className="container mx-auto px-4 py-16">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-purple-900/30 rounded-full">
                <Lock className="h-8 w-8 text-purple-400" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We are committed to protecting your privacy and ensuring the security of your personal information.
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
              Last updated: May 2025. For any questions about our privacy policy, please contact our data protection officer at no-reply@runit.in
            </p>
          </motion.div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
