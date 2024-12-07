'use client'

import { motion } from 'framer-motion'
import { Coins, Shield, TrendingUp, LineChart } from 'lucide-react'

const features = [
    {
        title: "Stablecoin Deposits",
        description: "Earn 8% APY with anytime withdrawals and compounded interest",
        icon: Coins,
        color: "bg-blue-500"
    },
    {
        title: "Meme Token Collateral",
        description: "Over-collateralization at 166% with flexible repayment terms",
        icon: Shield,
        color: "bg-green-500"
    },
    {
        title: "Real-time Oracle Pricing",
        description: "Accurate price feeds from Supra Oracle for secure lending",
        icon: LineChart,
        color: "bg-purple-500"
    },
    {
        title: "Dynamic Risk Management",
        description: "Automated health monitoring with 150% liquidation threshold",
        icon: TrendingUp,
        color: "bg-orange-500"
    }
]

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2
        }
    }
}

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
}

export default function Features() {
    return (
        <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl font-bold text-gray-900">Core Features</h2>
                    <p className="mt-4 text-xl text-gray-600">Everything you need for secure DeFi lending</p>
                </motion.div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-8"
                >
                    {features.map((feature, index) => {
                        const Icon = feature.icon
                        return (
                            <motion.div
                                key={index}
                                variants={item}
                                className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow"
                            >
                                <div className={`h-12 w-12 rounded-lg flex items-center justify-center mb-6 ${feature.color} bg-opacity-10`}>
                                    <Icon className={`h-6 w-6 ${feature.color} text-opacity-100`} />
                                </div>
                                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                                <p className="text-gray-600">{feature.description}</p>
                            </motion.div>
                        )
                    })}
                </motion.div>
            </div>
        </section>
    )
}