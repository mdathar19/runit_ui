"use client"
import React from 'react'
import { motion } from 'framer-motion';
import { features, containerVariants, itemVariants } from '@/utils/landing';
import { CheckCircle } from 'lucide-react';

const Features = () => {
  return (
    <motion.section 
        className="py-20"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            variants={itemVariants}
          >
            <h2 className="font-elegant text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Code Better</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              From writing code to creating portfolios, RunIt provides all the tools you need in one powerful platform
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.id}
                className="luxury-card p-6 group hover:scale-105 transition-all duration-300"
                variants={itemVariants}
                whileHover={{ y: -5 }}
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {React.cloneElement(feature.icon, { className: "h-8 w-8 text-white" })}
                </div>
                <h3 className="font-elegant text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-400 mb-4">{feature.description}</p>
                <ul className="space-y-1">
                  {feature.details.map((detail, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-500">
                      <CheckCircle className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
  )
}

export default Features
