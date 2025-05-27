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

  export const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  export const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

export const codeExamples = [
    "function findDuplicates(arr) {\n  return arr.filter((item, index) => \n    arr.indexOf(item) !== index);\n}",
    "def bubble_sort(arr):\n    for i in range(len(arr)):\n        for j in range(0, len(arr)-i-1):\n            if arr[j] > arr[j+1]:\n                arr[j], arr[j+1] = arr[j+1], arr[j]",
    "const factorial = (n) => {\n  return n <= 1 ? 1 : n * factorial(n - 1);\n};"
  ];
  
  export const features = [
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
  
  export const testimonials = [
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
  
  export const plans = [
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
  
  export const stats = [
    { label: 'Active Developers', value: '50K+', icon: <Users className="h-6 w-6" /> },
    { label: 'Code Executions', value: '1M+', icon: <Play className="h-6 w-6" /> },
    { label: 'Portfolios Created', value: '10K+', icon: <Globe className="h-6 w-6" /> },
    { label: 'Code Snippets', value: '100K+', icon: <ImageIcon className="h-6 w-6" /> }
  ];
  
  export const landingNnavigationItems = [
    {
      name: 'Create Snippet',
      href: '/create-snippet',
      icon: <Code className="h-4 w-4" />,
      gradient: 'from-purple-500 to-pink-500',
      description: 'Create beautiful code snippets'
    },
    {
      name: 'Host Portfolio',
      href: '/portfolio/create',
      icon: <Palette className="h-4 w-4" />,
      gradient: 'from-blue-500 to-cyan-500',
      description: 'Host stunning portfolios'
    },
    {
      name: 'Online Compiler',
      href: '/compiler/python',
      icon: <Terminal className="h-4 w-4" />,
      gradient: 'from-green-500 to-emerald-500',
      description: 'Run Python code online'
    }
  ];