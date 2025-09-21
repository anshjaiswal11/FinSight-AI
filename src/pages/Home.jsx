import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, BarChart3, DollarSign, Target, Clock, Shield, Brain, Zap, ArrowRight, Star, Users, Award, Eye, Lightbulb, PieChart, LineChart, Activity } from 'lucide-react';

const FinSightHomepage = () => {

  const [currentVersion, setCurrentVersion] = useState(1);
  const [animateNumbers, setAnimateNumbers] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setAnimateNumbers(true);
    const interval = setInterval(() => {
      setCurrentVersion(prev => prev === 7 ? 1 : prev + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <Target className="w-8 h-8" />,
      title: "Personalized Investment Plans",
      description: "AI-powered financial planning based on your goals, risk tolerance, and timeline"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Real-time Stock Analysis",
      description: "Technical & fundamental analysis for Indian ADRs and US stocks with actionable insights"
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI Investment Insights",
      description: "Deep learning algorithms provide intelligent recommendations and market predictions"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Risk Assessment",
      description: "Comprehensive risk analysis tailored to Indian and US market conditions"
    }
  ];

  const stats = [
    { number: "1K+", label: "Active Users", icon: <Users className="w-6 h-6" /> },
    { number: "₹2.5Cr+", label: "Assets Analyzed", icon: <DollarSign className="w-6 h-6" /> },
    { number: "95%", label: "Accuracy Rate", icon: <Target className="w-6 h-6" /> },
    { number: "24/7", label: "Market Monitoring", icon: <Activity className="w-6 h-6" /> }
  ];

  const versions = [
    { 
      version: "v1.0", 
      name: "Budget Planner", 
      description: "Get personalized investment advice based on your budget and financial goals",
      route: "/budget",
      icon: <DollarSign className="w-5 h-5" />
    },
    { 
      version: "v2.0", 
      name: "Stock Analysis", 
      description: "Fundamental analysis and investment suggestions for stocks and securities",
      route: "/analysis",
      icon: <BarChart3 className="w-5 h-5" />
    },
    { 
      version: "v3.0", 
      name: "Portfolio Optimizer", 
      description: "AI-driven portfolio optimization and rebalancing recommendations",
      route: "/portfolio",
      icon: <PieChart className="w-5 h-5" />
    },
    { 
      version: "v4.0", 
      name: "Risk Analyzer", 
      description: "Comprehensive risk assessment and stress testing for investments",
      route: "/risk",
      icon: <Shield className="w-5 h-5" />
    },
    { 
      version: "v5.0", 
      name: "Market Predictor", 
      description: "Advanced ML models for market trend prediction and timing",
      route: "/predict",
      icon: <Eye className="w-5 h-5" />
    },
    { 
      version: "v6.0", 
      name: "Tax Optimizer", 
      description: "Smart tax planning and optimization strategies for investments",
      route: "/tax",
      icon: <Lightbulb className="w-5 h-5" />
    },
    { 
      version: "v7.0", 
      name: "Wealth Tracker", 
      description: "Real-time wealth tracking and performance analytics dashboard",
      route: "/wealth",
      icon: <LineChart className="w-5 h-5" />
    }
  ];

  return (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden mt-0">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-green-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Floating Stock Tickers */}
      <div className="fixed top-0 left-0 right-0 h-12 bg-black/20 backdrop-blur-sm border-b border-gray-800 flex items-center overflow-hidden">
        <div className="animate-scroll flex items-center space-x-8 whitespace-nowrap">
          <span className="text-green-400 font-mono">NIFTY: 19,674.25 ↗ +1.2%</span>
          <span className="text-red-400 font-mono">SENSEX: 66,589.93 ↘ -0.8%</span>
          <span className="text-green-400 font-mono">S&P 500: 4,567.18 ↗ +0.9%</span>
          <span className="text-blue-400 font-mono">NASDAQ: 14,223.94 ↗ +1.5%</span>
          <span className="text-yellow-400 font-mono">GOLD: ₹61,450 ↗ +0.3%</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 pt-12 px-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              FinSight-AI
            </h1>
          </div>
          <a 
            href="https://www.citewise.xyz/contact"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6 py-2 rounded-full font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
          >
            Work With Us
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 max-w-7xl mx-auto pt-20 pb-32">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-6xl md:text-7xl lg:text-8xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
                AI-Powered
              </span>
              <br />
              <span className="text-white">Financial Intelligence</span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Transform your investment journey with cutting-edge AI analysis for Indian and US markets. 
              Get personalized insights, real-time data, and intelligent recommendations.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 pt-8">
            <button
              className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/25 flex items-center space-x-2"
              onClick={() => navigate('/analysis')}
            >
              <Zap className="w-5 h-5 group-hover:animate-bounce" />
              <span>Start Analysis</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="border-2 border-gray-600 hover:border-purple-400 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:bg-purple-500/10 hover:scale-105">
              View Features
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className={`text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-gray-800 hover:border-purple-400/50 transition-all duration-500 hover:scale-105 ${animateNumbers ? 'animate-fade-in-up' : ''}`}
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="flex justify-center mb-3 text-purple-400">
                {stat.icon}
              </div>
              <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-6 max-w-7xl mx-auto pb-32">
        <div className="text-center mb-16">
          <h3 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Powerful Features
            </span>
          </h3>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Leverage advanced AI and real-time data to make smarter investment decisions
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group p-8 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-gray-800 hover:border-purple-400/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20"
            >
              <div className="text-purple-400 mb-6 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h4 className="text-xl font-semibold mb-4 text-white">{feature.title}</h4>
              <p className="text-gray-400 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Version Showcase */}
      <section className="relative z-10 px-6 max-w-7xl mx-auto pb-32">
        <div className="text-center mb-16">
          <h3 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              Platform Versions
            </span>
          </h3>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Explore all seven versions of our comprehensive financial analysis platform
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {versions.map((version, index) => (
            <div 
              key={index}
              className={`group p-6 rounded-2xl border transition-all duration-500 hover:scale-105 cursor-pointer ${
                currentVersion === index + 1 
                  ? 'bg-gradient-to-br from-purple-600/20 to-blue-600/20 border-purple-400 shadow-2xl shadow-purple-500/20' 
                  : 'bg-white/5 border-gray-800 hover:border-purple-400/50 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className={`p-2 rounded-lg ${currentVersion === index + 1 ? 'bg-purple-500' : 'bg-gray-700 group-hover:bg-purple-500'} transition-colors duration-300`}>
                  {version.icon}
                </div>
                <div>
                  <span className="text-sm text-gray-400">{version.version}</span>
                  <h4 className="text-lg font-semibold text-white">{version.name}</h4>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">{version.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-purple-400 font-mono">{version.route}</span>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-purple-400 group-hover:translate-x-1 transition-all duration-300" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="relative z-10 px-6 max-w-7xl mx-auto pb-16">
        <div className="text-center bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl p-12 border border-purple-400/30">
          <h3 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Ready to Transform Your Investments?
          </h3>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of smart investors using AI-powered insights to grow their wealth
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/25">
              Get Started Free
            </button>
            <a 
              href="https://www.citewise.xyz/contact"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 font-semibold text-lg transition-colors duration-300 flex items-center space-x-2"
            >
              <span>Partner With Us</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes scroll {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default FinSightHomepage;