"use client"
import React from 'react';
import { motion } from 'framer-motion';
import { Scale, FileText, AlertCircle, ShieldCheck, Users, Zap } from 'lucide-react';

const TermsOfService = () => {
  const sections = [
    {
      title: "Account Terms",
      icon: <Users className="h-6 w-6" />,
      content: [
        "You must be 13 years or older to use this service",
        "You must provide accurate and complete registration information",
        "You are responsible for maintaining account security",
        "One person or entity may not maintain more than one free account",
        "You must not use the service for any illegal purposes"
      ]
    },
    {
      title: "Service Rules",
      icon: <Scale className="h-6 w-6" />,
      content: [
        "Do not violate intellectual property rights",
        "Do not upload malicious code or content",
        "Do not attempt to breach security measures",
        "Do not use the service to spam or harass",
        "Respect rate limits and API guidelines"
      ]
    },
    {
      title: "Content Rights",
      icon: <FileText className="h-6 w-6" />,
      content: [
        "You retain rights to content you create",
        "Grant us license to host and share your content",
        "You are responsible for content you post",
        "We may remove content that violates terms",
        "Respect others' intellectual property"
      ]
    },
    {
      title: "Limitations",
      icon: <AlertCircle className="h-6 w-6" />,
      content: [
        "Service provided 'as is' without warranty",
        "We are not responsible for data loss",
        "May change or terminate service at any time",
        "Not liable for service interruptions",
        "Usage limits may apply to free accounts"
      ]
    }
  ];

  return (
    <div className="bg-gradient-to-b from-black to-gray-900 text-white">
      <div className="inset-0">
        <div className="inset-0 bg-gradient-to-r from-purple-900/20 via-blue-900/20 to-cyan-900/20" />
        <div 
          className="inset-0" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            opacity: 0.3
          }}
        />
      

      <div className="z-10">
        <div className="container mx-auto px-4 py-16">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-purple-900/30 rounded-full">
                <ShieldCheck className="h-8 w-8 text-purple-400" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Please read these terms carefully before using RunIt's services.
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
              Last updated: May 2025. By using our services, you agree to these terms. For any questions, please contact no-reply@runit.in
            </p>
          </motion.div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default TermsOfService;
