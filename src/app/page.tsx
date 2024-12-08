'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Wallet, LineChart, TrendingUp, Users, DollarSign, Shield, Zap, Lock, RefreshCw, ChevronRight, Github, Twitter } from 'lucide-react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { useRouter } from 'next/navigation'

export default function Home() {
  const [network, setNetwork] = useState<'supra' | 'citrea'>('supra')
  const [activeTab, setActiveTab] = useState('home')
  const router = useRouter()

  const getNetworkColor = (type: 'primary' | 'gradient' | 'soft' = 'primary') => {
    if (network === 'supra') {
      if (type === 'gradient') return 'bg-supra-main'
      if (type === 'soft') return 'bg-supra-soft'
      return 'text-supra-primary'
    }
    if (type === 'gradient') return 'bg-citrea-main'
    if (type === 'soft') return 'bg-citrea-soft'
    return 'text-citrea-primary'
  }

  const handleDashboard = () => {
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className={`absolute inset-0 opacity-10 ${getNetworkColor('gradient')}`} />
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute rounded-full ${getNetworkColor('gradient')} opacity-5`}
              animate={{
                x: [Math.random() * 1000, Math.random() * -1000],
                y: [Math.random() * 1000, Math.random() * -1000],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 20 + Math.random() * 10,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              style={{
                width: `${Math.random() * 300 + 50}px`,
                height: `${Math.random() * 300 + 50}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <motion.div
              className={`inline-block px-4 py-2 rounded-full backdrop-blur-md 
                ${getNetworkColor('soft')} ${getNetworkColor()}`}
              whileHover={{ scale: 1.05 }}
            >
              🚀 Welcome to the Future of DeFi
            </motion.div>

            <h1 className="text-6xl md:text-7xl font-bold tracking-tight">
              The Sweetest
              <span className={`ml-4 px-4 py-2 rounded-xl ${getNetworkColor('gradient')} text-white`}>
                DeFi
              </span>
              <br />Protocol
            </h1>

            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Earn 8% APY on your stablecoins and borrow against your meme tokens.
              Simple, secure, and efficient lending.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.button onClick={handleDashboard}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-8 py-4 rounded-xl font-medium text-white shadow-xl
                  flex items-center gap-2 ${getNetworkColor('gradient')}`}
              >
                Launch App <ArrowRight className="h-5 w-5" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-xl font-medium border-2 border-gray-200
                  hover:border-gray-300 transition-colors flex items-center gap-2"
              >
                Learn More <ChevronRight className="h-5 w-5" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Total Value Locked", value: "$1.2M+", icon: DollarSign },
              { title: "Active Users", value: "2,800+", icon: Users },
              { title: "Average APY", value: "8%", icon: TrendingUp }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className={`relative overflow-hidden rounded-2xl p-8
                  backdrop-blur-md shadow-xl border border-gray-100`}
              >
                <div className={`absolute top-0 left-0 w-1.5 h-full ${getNetworkColor('gradient')}`} />
                <stat.icon className={`h-8 w-8 mb-4 ${getNetworkColor()}`} />
                <div className="text-4xl font-bold">{stat.value}</div>
                <div className="text-gray-600 mt-2">{stat.title}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className={`py-20 ${getNetworkColor('soft')}`}>
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Get started in three simple steps</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Connect Wallet", icon: Wallet, description: "Connect your wallet to start earning" },
              { title: "Choose Strategy", icon: LineChart, description: "Deposit or borrow based on your needs" },
              { title: "Earn Rewards", icon: Zap, description: "Watch your assets grow automatically" }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="relative bg-white rounded-2xl p-8 shadow-xl"
              >
                <div className={`absolute -top-4 left-8 w-8 h-8 rounded-full 
                  ${getNetworkColor('gradient')} text-white flex items-center justify-center font-bold`}>
                  {index + 1}
                </div>
                <step.icon className={`h-8 w-8 mb-4 ${getNetworkColor()}`} />
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Core Features</h2>
            <p className="text-xl text-gray-600">Everything you need for secure DeFi lending</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "High APY", icon: TrendingUp, description: "Earn competitive yields on deposits" },
              { title: "Secure Protocol", icon: Shield, description: "Battle-tested smart contracts" },
              { title: "Real-time Analytics", icon: LineChart, description: "Monitor your positions live" }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="rounded-2xl p-8 bg-white shadow-xl border border-gray-100"
              >
                <div className={`w-12 h-12 rounded-xl mb-6 ${getNetworkColor('soft')} 
                  flex items-center justify-center`}>
                  <feature.icon className={`h-6 w-6 ${getNetworkColor()}`} />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="col-span-1">
              <div className={`font-bold text-xl ${getNetworkColor()} mb-4`}>
                🧀 Cheesecake
              </div>
              <p className="text-gray-600">The sweetest DeFi protocol</p>
            </div>

            {/* Quick Links */}
            <div className="col-span-1">
              <h3 className="font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">Docs</a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">FAQ</a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">Security</a>
                </li>
              </ul>
            </div>

            {/* Social */}
            <div className="col-span-1">
              <h3 className="font-bold mb-4">Community</h3>
              <div className="flex space-x-4">
                <motion.a
                  href="#"
                  whileHover={{ scale: 1.1 }}
                  className={`p-2 rounded-full ${getNetworkColor('soft')}`}
                >
                  <Twitter className={`h-5 w-5 ${getNetworkColor()}`} />
                </motion.a>
                <motion.a
                  href="#"
                  whileHover={{ scale: 1.1 }}
                  className={`p-2 rounded-full ${getNetworkColor('soft')}`}
                >
                  <Github className={`h-5 w-5 ${getNetworkColor()}`} />
                </motion.a>
              </div>
            </div>

            {/* Newsletter */}
            <div className="col-span-1">
              <h3 className="font-bold mb-4">Stay Updated</h3>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 rounded-l-lg border focus:outline-none focus:ring-2 focus:ring-gray-200"
                />
                <button className={`px-4 py-2 ${getNetworkColor('gradient')} text-white rounded-r-lg`}>
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-600">© 2024 Cheesecake Finance. All rights reserved.</p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="text-gray-600 hover:text-gray-900">Terms</a>
                <a href="#" className="text-gray-600 hover:text-gray-900">Privacy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

