"use client"
import React from 'react'
import { motion } from 'framer-motion';
import { containerVariants, itemVariants } from '@/utils/landing';
import { stats } from '@/utils/landing';



const StatsSection = () => {
  return (
    <section className="py-16 bg-black/40">
        <div className="container mx-auto px-4">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                variants={itemVariants}
              >
                <div className="flex justify-center mb-2">
                  <div className="p-3 bg-purple-900/30 rounded-full">
                    {React.cloneElement(stat.icon, { className: "h-6 w-6 text-purple-400" })}
                  </div>
                </div>
                <div className="text-2xl md:text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
  )
}

export default StatsSection
