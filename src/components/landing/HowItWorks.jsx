"use client"
import React from 'react'
import { motion } from 'framer-motion';
import { Code, Bot, Rocket } from 'lucide-react';



const HowItWorks = () => {
  return (
    <section className="py-20 bg-black/40">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">From Idea to Deployment in <span className="text-purple-400">3 Steps</span></h2>
            <p className="text-xl text-gray-300">See how easy it is to go from concept to live project</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Code & Create',
                description: 'Use our online IDE with AI assistance to write code, or generate snippets with beautiful backgrounds',
                icon: <Code className="h-8 w-8" />,
                gradient: 'from-blue-500 to-purple-500'
              },
              {
                step: '02',
                title: 'Enhance with AI',
                description: 'Upload your resume and let AI generate a professional portfolio, or ask AI to write functions for you',
                icon: <Bot className="h-8 w-8" />,
                gradient: 'from-purple-500 to-pink-500'
              },
              {
                step: '03',
                title: 'Share & Deploy',
                description: 'Publish your portfolio with a custom subdomain, or export your code snippets as beautiful images',
                icon: <Rocket className="h-8 w-8" />,
                gradient: 'from-pink-500 to-red-500'
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <div className="luxury-card p-8 text-center h-full">
                  <div className={`w-16 h-16 bg-gradient-to-r ${step.gradient} rounded-full flex items-center justify-center mx-auto mb-6`}>
                    {React.cloneElement(step.icon, { className: "h-8 w-8 text-white" })}
                  </div>
                  <div className="text-4xl font-bold text-purple-400 mb-4">{step.step}</div>
                  <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
                  <p className="text-gray-400">{step.description}</p>
                </div>
                
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-purple-500 to-transparent"></div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
  )
}

export default HowItWorks
