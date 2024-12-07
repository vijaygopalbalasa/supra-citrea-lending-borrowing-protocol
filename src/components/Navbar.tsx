'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Wallet } from 'lucide-react'

export default function Navbar() {
    const [network, setNetwork] = useState<'supra' | 'citrea'>('supra')
    const [isConnected, setIsConnected] = useState(false)

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

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="fixed top-0 w-full z-50 backdrop-blur-md border-b border-gray-200/50"
        >
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between h-20">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center space-x-2"
                    >
                        <span className={`text-2xl font-bold ${getNetworkColor()}`}>
                            🧀 Cheesecake Finance
                        </span>
                    </motion.div>

                    <div className="flex items-center space-x-4">
                        <div className="bg-gray-100/50 p-1 rounded-lg flex space-x-1">
                            {['supra', 'citrea'].map((net) => (
                                <motion.button
                                    key={net}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setNetwork(net as 'supra' | 'citrea')}
                                    className={`px-4 py-2 rounded-md font-medium transition-all
                    ${network === net
                                            ? `${getNetworkColor('gradient')} text-white shadow-lg`
                                            : 'hover:bg-gray-200'
                                        }`}
                                >
                                    {net.charAt(0).toUpperCase() + net.slice(1)}
                                </motion.button>
                            ))}
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsConnected(!isConnected)}
                            className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-medium 
                shadow-lg ${getNetworkColor('gradient')} text-white`}
                        >
                            <Wallet className="h-5 w-5" />
                            <span>{isConnected ? '0x1234...5678' : 'Connect Wallet'}</span>
                        </motion.button>
                    </div>
                </div>
            </div>
        </motion.nav>
    )
}