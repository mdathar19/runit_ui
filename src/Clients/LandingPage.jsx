import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Code, 
  Zap, 
  Image as ImageIcon, 
  Globe, 
  Sparkles, 
  ArrowRight, 
  Play, 
  Download, 
  FileCode, 
  Palette, 
  Rocket,
  CheckCircle,
  Star,
  Users,
  Clock,
  Shield,
  Layers,
  Terminal,
  Bot,
  Eye,
  Settings,
  Crown,
  Upload,
  Edit,
  Share,
  MonitorPlay
} from 'lucide-react';

const RunItLanding = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [typedText, setTypedText] = useState('');
  
  const codeExamples = [
    "function findDuplicates(arr) {\n  return arr.filter((item, index) => \n    arr.indexOf(item) !== index);\n}",
    "def bubble_sort(arr):\n    for i in range(len(arr)):\n        for j in range(0, len(arr)-i-1):\n            if arr[j] > arr[j+1]:\n                arr[j], arr[j+1] = arr[j+1], arr[j]",
    "const factorial = (n) => {\n  return n <= 1 ? 1 : n * factorial(n - 1);\n};"
  ];

  const features = [
    {
      id: 'compiler',
      icon: <Terminal className="h-8 w-8" />,
      title: 'Multi-Language Online Compiler',
      description: 'Code in 15+ languages with real-time execution and instant output',
      gradient: 'from-blue-500 to-cyan-500',
      details: ['JavaScript, Python, C++, Java, Rust, Go', 'Real-time code execution', 'Syntax highlighting & auto-completion', 'Error detection and debugging']
    },
    {
      id: 'ai-assistant',
      icon: <Bot className="h-8 w-8" />,
      title: 'AI-Powered Code Assistant',
      description: 'Generate functions instantly with natural language prompts',
      gradient: 'from-purple-500 to-pink-500',
      details: ['Natural language to code conversion', 'One-click code insertion', 'Smart function generation', 'Context-aware suggestions']
    },
    {
      id: 'snippet',
      icon: <ImageIcon className="h-8 w-8" />,
      title: 'Beautiful Code Snippets',
      description: 'Create stunning code snippets with customizable backgrounds',
      gradient: 'from-green-500 to-teal-500',
      details: ['Multiple design templates', 'Custom background options', 'Direct image export', 'Social media ready formats']
    },
    {
      id: 'portfolio',
      icon: <Globe className="h-8 w-8" />,
      title: 'AI Portfolio Generator',
      description: 'Create and host professional portfolios in under 5 minutes',
      gradient: 'from-orange-500 to-red-500',
      details: ['Resume-based AI generation', 'Custom subdomain hosting', 'Real-time editing', 'Professional templates']
    }
  ];

  const testimonials = [
    {
      id: 1,
      name: 'Alex Chen',
      role: 'Software Engineer',
      avatar: 'AC',
      content: "RunIt transformed my development workflow. The AI code assistant saves me hours every day!",
      rating: 5
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      role: 'Full Stack Developer',
      avatar: 'SJ',
      content: "Created my portfolio in 3 minutes using my resume. The AI enhancement is incredible!",
      rating: 5
    },
    {
      id: 3,
      name: 'Michael Rodriguez',
      role: 'CS Student',
      avatar: 'MR',
      content: "The code snippet generator helped me create beautiful documentation for my projects.",
      rating: 5
    }
  ];

  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for getting started',
      features: [
        'Online compiler access',
        'Basic AI code assistant',
        '1 code snippet per day',
        '1 portfolio template',
        'Community support'
      ],
      buttonText: 'Get Started Free',
      popular: false
    },
    {
      name: 'Pro',
      price: '$9',
      period: 'month',
      description: 'For serious developers',
      features: [
        'Unlimited compiler usage',
        'Advanced AI code assistant',
        'Unlimited code snippets',
        '10 portfolio templates',
        'Custom subdomain hosting',
        'Priority support',
        'Advanced customization'
      ],
      buttonText: 'Start Pro Trial',
      popular: true
    },
    {
      name: 'Enterprise',
      price: '$29',
      period: 'month',
      description: 'For teams and organizations',
      features: [
        'Everything in Pro',
        'Team collaboration',
        'Custom branding',
        'API access',
        'Advanced analytics',
        'Dedicated support',
        'Custom integrations'
      ],
      buttonText: 'Contact Sales',
      popular: false
    }
  ];

  const stats = [
    { label: 'Active Developers', value: '50K+', icon: <Users className="h-6 w-6" /> },
    { label: 'Code Executions', value: '1M+', icon: <Play className="h-6 w-6" /> },
    { label: 'Portfolios Created', value: '10K+', icon: <Globe className="h-6 w-6" /> },
    { label: 'Code Snippets', value: '100K+', icon: <ImageIcon className="h-6 w-6" /> }
  ];

  const svgPatterns = {
    dots: "data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E",
    circles: "data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"
  };

  // Typing animation effect
  useEffect(() => {
    setIsVisible(true);
    const text = "write a function to find duplicates in an array";
    let index = 0;
    const timer = setInterval(() => {
      if (index <= text.length) {
        setTypedText(text.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 100);
    return () => clearInterval(timer);
  }, []);

  // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [features.length]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white overflow-hidden">
      {/* Hero Section */}
      <motion.section 
        className="relative pt-20 pb-16 md:pt-32 md:pb-24"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-blue-900/20 to-cyan-900/20" />
          <div 
            className="absolute inset-0" 
            style={{
              backgroundImage: `url("${svgPatterns.dots}")`,
              opacity: 0.3
            }}
          />
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
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Code, Create, and 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400"> Deploy</span> in Minutes
              </h1>
              
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                The ultimate development platform with AI-powered coding assistance, beautiful snippet creation, and instant portfolio generation. Everything you need to build, showcase, and share your work.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <motion.button
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Start Coding Free <ArrowRight className="ml-2 h-5 w-5" />
                </motion.button>
                
                <motion.button
                  className="border border-gray-600 hover:border-gray-500 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 flex items-center justify-center backdrop-blur-sm bg-gray-800/20"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play className="mr-2 h-5 w-5" /> See Demo
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

      {/* Stats Section */}
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

      {/* Features Section */}
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
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
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
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

      {/* How It Works */}
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

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Loved by <span className="text-purple-400">Developers</span></h2>
            <p className="text-xl text-gray-300">See what our community has to say</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <motion.div
                key={testimonial.id}
                className="luxury-card p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex text-yellow-400 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 italic">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-bold">{testimonial.avatar}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-black/40">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, <span className="text-purple-400">Transparent</span> Pricing</h2>
            <p className="text-xl text-gray-300">Choose the plan that fits your needs</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={index}
                className={`luxury-card p-8 relative ${plan.popular ? 'border-purple-500 scale-105' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="mb-2">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-gray-400">/{plan.period}</span>
                  </div>
                  <p className="text-gray-400">{plan.description}</p>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <motion.button
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                      : 'border border-gray-600 hover:border-gray-500 text-white hover:bg-gray-800/20'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {plan.buttonText}
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-900/20 to-pink-900/20 relative overflow-hidden">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `url("${svgPatterns.circles}")`,
            opacity: 0.2
          }}
        />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2 
              className="text-3xl md:text-5xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Ready to Transform Your Development Experience?
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-300 mb-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Join thousands of developers who are already coding smarter, creating better, and deploying faster with RunIt.
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <motion.button
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Building Now <ArrowRight className="ml-2 h-5 w-5" />
              </motion.button>
              <motion.button
                className="border border-gray-600 hover:border-gray-500 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-300 flex items-center justify-center backdrop-blur-sm bg-gray-800/20"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Play className="mr-2 h-5 w-5" /> Watch Demo
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-black/60 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-2">
                  <Code className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">RunIt</span>
              </div>
              <p className="text-gray-400 mb-4">
                The ultimate development platform for modern developers. Code, create, and deploy with AI assistance.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Online Compiler</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">AI Code Assistant</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Code Snippets</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Portfolio Generator</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Templates</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">API Reference</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Community</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 mb-4 md:mb-0">
              © 2024 RunIt. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default RunItLanding;