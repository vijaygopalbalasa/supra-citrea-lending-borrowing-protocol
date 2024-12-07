'use client'

import { motion } from 'framer-motion'
import { Wallet, ArrowRight, Coins, LineChart } from 'lucide-react'

const steps = [
    {
        title: "Connect Wallet",
        description: "Connect your wallet to start interacting with the protocol",
        icon: Wallet
    },
    {
        title: "Choose Your Strategy",
        description: "Deposit stablecoins to earn or use meme tokens as collateral",
        icon: Coins
    },
    {
        title: "Watch Your Assets Grow",
        description: "Monitor your positions and earnings in real-time",
        icon: LineChart
    }
]

export default function HowItWorks() {
    return (
        <section className="py-20 bg-gradient-to-b from-white to-gray-50">
            <div className="max-w-7xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl font-bold text-gray-900">How It Works</h2>
                    <p className="mt-4 text-xl text-gray-600">Get started in three simple steps</p>
                </motion.div>

                <div className="relative">
                    {/* Connection Line */}
                    <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2" />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                        {steps.map((step, index) => {
                            const Icon = step.icon
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.2 }}
                                    className="relative bg-white p-8 rounded-2xl shadow-xl border border-gray-100"
                                >
                                    <div className="absolute top-5 right-5 text-gray-200 text-6xl font-bold -z-10">
                                        {index + 1}
                                    </div>
                                    <div className="h-12 w-12 bg-red-50 rounded-lg flex items-center justify-center mb-6">
                                        <Icon className="h-6 w-6 text-red-600" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-4">{step.title}</h3>
                                    <p className="text-gray-600">{step.description}</p>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </section>
    )
}