'use client'

import { motion } from 'framer-motion'
import { DollarSign, Users, TrendingUp } from 'lucide-react'

const stats = [
    {
        title: "Total Value Locked",
        value: "$1.2M+",
        change: "+12.3%",
        icon: DollarSign
    },
    {
        title: "Active Users",
        value: "2,800+",
        change: "+22.4%",
        icon: Users
    },
    {
        title: "Average APY",
        value: "8%",
        change: "+2.1%",
        icon: TrendingUp
    }
]

export default function Stats() {
    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow"
                            >
                                <div className="h-12 w-12 bg-red-50 rounded-lg flex items-center justify-center mb-6">
                                    <Icon className="h-6 w-6 text-red-600" />
                                </div>
                                <div className="text-4xl font-bold text-gray-900">{stat.value}</div>
                                <div className="flex items-center mt-2">
                                    <span className="text-green-500 text-sm">{stat.change}</span>
                                    <span className="text-gray-600 text-sm ml-2">from last month</span>
                                </div>
                                <div className="text-gray-600 mt-2">{stat.title}</div>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}