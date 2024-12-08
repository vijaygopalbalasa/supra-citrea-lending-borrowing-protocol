'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { DollarSign, TrendingUp, Shield, PieChart, ArrowUpRight, ArrowDownRight, Wallet, RefreshCcw } from 'lucide-react'

export default function Dashboard() {
    console.log("Dashboard component rendered");
    const [network, setNetwork] = useState<'supra'>('supra')
    const [isConnected, setIsConnected] = useState(false)

    const getNetworkStyles = (network: 'supra') => ({
        background: network === 'supra' ? 'bg-red-600' : 'bg-orange-500',
        text: network === 'supra' ? 'text-red-600' : 'text-orange-500',
        lighter: network === 'supra' ? 'bg-red-50' : 'bg-orange-50',
    })

    const networkStyles = getNetworkStyles(network)

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Network Selector & Wallet */}
            <header className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                            <button
                                onClick={() => setNetwork('supra')}
                                className={`px-4 py-2 rounded-lg ${network === 'supra' ? 'bg-red-600 text-white' : 'bg-gray-100'
                                    }`}
                            >
                                SUPRA Network
                            </button>
                        </div>
                        <button
                            onClick={() => setIsConnected(!isConnected)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${networkStyles.background
                                } text-white`}
                        >
                            <Wallet className="h-4 w-4" />
                            <span>{isConnected ? '0x1234...5678' : 'Connect Wallet'}</span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    {[
                        { title: "Total Deposits", value: "$0.00", icon: DollarSign },
                        { title: "Total Borrowed", value: "$0.00", icon: ArrowDownRight },
                        { title: "Available to Borrow", value: "$0.00", icon: ArrowUpRight },
                        { title: "Health Factor", value: "0.00", icon: PieChart }
                    ].map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-xl shadow-sm p-6"
                        >
                            <div className="flex justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">{stat.title}</p>
                                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                                </div>
                                <div className={`p-2 rounded-lg ${networkStyles.lighter}`}>
                                    <stat.icon className={`h-5 w-5 ${networkStyles.text}`} />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Main Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Lending Card */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Lending</h2>
                            <div className={`px-3 py-1 rounded-full text-sm ${networkStyles.text}`}>
                                8% APY
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="flex justify-between mb-2">
                                    <span>Your Deposits</span>
                                    <span className="font-bold">0.00 USDT</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Earned Interest</span>
                                    <span className="text-green-500 font-bold">+0.00 USDT</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Amount to Deposit
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="0.00"
                                        className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-gray-200"
                                    />
                                    <button className="absolute right-2 top-2 px-2 py-1 text-sm bg-gray-100 rounded">
                                        MAX
                                    </button>
                                </div>
                            </div>

                            <button className={`w-full py-3 ${networkStyles.background} text-white rounded-lg`}>
                                Deposit USDT
                            </button>
                        </div>
                    </div>

                    {/* Borrowing Card */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Borrowing</h2>
                            <div className={`px-3 py-1 rounded-full text-sm ${networkStyles.text}`}>
                                166% Required
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="flex justify-between mb-2">
                                    <span>Your Collateral</span>
                                    <span className="font-bold">0.00 DOGE</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Available to Borrow</span>
                                    <span className="font-bold">0.00 USDT</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Amount to Borrow
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="0.00"
                                        className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-gray-200"
                                    />
                                    <button className="absolute right-2 top-2 px-2 py-1 text-sm bg-gray-100 rounded">
                                        MAX
                                    </button>
                                </div>
                            </div>

                            <button className={`w-full py-3 mb-2 border-2 ${networkStyles.text} border-current rounded-lg`}>
                                Deposit Collateral
                            </button>
                            <button className={`w-full py-3 ${networkStyles.background} text-white rounded-lg`}>
                                Borrow USDT
                            </button>
                        </div>
                    </div>
                </div>

                {/* Risk Metrics */}
                <div className="mt-8">
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-xl font-bold mb-6">Risk Metrics</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="text-sm text-gray-600 mb-1">Collateral Ratio</div>
                                <div className="text-2xl font-bold text-green-500">166%</div>
                                <div className="text-xs text-gray-500">Minimum: 150%</div>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="text-sm text-gray-600 mb-1">Liquidation Price</div>
                                <div className="text-2xl font-bold">$0.00</div>
                                <div className="text-xs text-gray-500">Current: $0.00</div>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="text-sm text-gray-600 mb-1">Health Factor</div>
                                <div className="text-2xl font-bold text-green-500">1.5</div>
                                <div className="text-xs text-gray-500">Safe 1.0</div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

